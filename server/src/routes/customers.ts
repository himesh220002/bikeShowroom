import { Router } from 'express';
import mongoose from 'mongoose';
import Customer from '../models/Customer';
import Sale from '../models/Sale';
import Service from '../models/Service';

const router = Router();

// Fetch all customers with their purchase and service history for the CRM
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        const allServices = await Service.find().sort({ createdAt: -1 });

        const enhancedCustomers = await Promise.all(customers.map(async (customer) => {
            // Find last sale for this customer
            const lastSale = await Sale.findOne({ customerId: customer._id }).sort({ createdAt: -1 });

            // Find all bikes registered by this user (UserBike model)
            const UserBike = mongoose.model('UserBike');
            const userBikes = await UserBike.find({ userId: customer.googleId || customer._id });

            // Find service count (completed services)
            const serviceCount = await Service.countDocuments({ customerId: customer._id, status: 'completed' });

            // Find latest service (for vehicle info)
            const latestService = await Service.findOne({ customerId: customer._id }).sort({ createdAt: -1 });
            const regNumber = latestService?.regNumber || lastSale?.registrationNumber || (userBikes.length > 0 ? userBikes[0].registrationNumber : "N/A");

            // MAPPING LOGIC: Match this customer to any current scheduled service
            const matchedService = allServices.find(s => {
                if (regNumber !== "N/A" && s.regNumber === regNumber) return true;
                const nameMatch = s.name.toLowerCase().trim() === customer.name.toLowerCase().trim();
                const phoneMatch = s.phone.replace(/\D/g, '') === customer.phone.replace(/\D/g, '');
                return nameMatch && phoneMatch;
            });

            // Dynamic Service Tracker Logic
            let serviceMilestone = "N/A";
            let nextServiceDue = null;
            let isFreeService = false;

            if (lastSale) {
                const purchaseDate = new Date(lastSale.createdAt);
                const nextServiceInDays = 30 + (serviceCount * 120);
                nextServiceDue = new Date(purchaseDate.getTime() + (nextServiceInDays * 24 * 60 * 60 * 1000));

                const milestoneNumber = serviceCount + 1;
                isFreeService = milestoneNumber <= 4;

                const ordinal = (n: number) => {
                    const s = ["th", "st", "nd", "rd"];
                    const v = n % 100;
                    return n + (s[(v - 20) % 10] || s[v] || s[0]);
                };
                serviceMilestone = `${ordinal(milestoneNumber)} ${isFreeService ? 'FREE' : 'PAID'} SERVICE`;
            }

            return {
                ...customer.toObject(),
                nextServiceDue: nextServiceDue,
                serviceMilestone: serviceMilestone,
                isFreeService: isFreeService,
                reminderStatus: customer.reminderStatus || "",
                regNumber: regNumber,
                chassisNumber: lastSale?.chassisNumber || (userBikes.length > 0 ? userBikes[0].chassisNumber : "N/A"),
                engineNumber: lastSale?.engineNumber || "N/A",
                lastSale: lastSale ? {
                    bikeName: lastSale.bikeName,
                    variant: lastSale.variant,
                    salePrice: lastSale.salePrice,
                    saleDate: lastSale.createdAt,
                    invoiceNumber: lastSale.invoiceNumber,
                    deliveryDate: lastSale.deliveryDate,
                    paymentMethod: lastSale.paymentMethod,
                    financeProvider: lastSale.financeProvider,
                    salesperson: lastSale.salesperson,
                    chassisNumber: lastSale.chassisNumber,
                    registrationNumber: lastSale.registrationNumber,
                    engineNumber: lastSale.engineNumber
                } : null,
                userBikes: userBikes.map((ub: any) => ({
                    model: ub.bikeModel,
                    regNo: ub.registrationNumber,
                    docs: ub.documents,
                    mods: ub.modifications,
                    score: ub.conditionScore
                })),
                serviceHistory: {
                    totalCount: serviceCount,
                    latest: latestService ? {
                        status: latestService.status,
                        date: latestService.createdAt,
                        serviceType: latestService.serviceType
                    } : null
                }
            };
        }));

        res.json({
            success: true,
            data: enhancedCustomers
        });
    } catch (error: any) {
        console.error("Master DB Fetch Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { registrationNumber, ...customerData } = req.body;

        // 1. Update Customer Model
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: customerData },
            { new: true }
        );
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

        // 2. If registrationNumber is provided, sync it across Sale and UserBike
        if (registrationNumber) {
            // Update latest Sale
            const lastSale = await Sale.findOne({ customerId: customer._id }).sort({ createdAt: -1 });
            if (lastSale) {
                lastSale.registrationNumber = registrationNumber;
                lastSale.registrationVerified = true;
                await lastSale.save();

                // Find the actual User record by phone to sync to their individual garage
                const User = mongoose.model('User');
                const matchedUser = await User.findOne({ phone: customer.phone });

                // Update UserBike (Source of Truth)
                const UserBike = mongoose.model('UserBike');
                await UserBike.updateMany(
                    {
                        $or: [
                            { chassisNumber: { $regex: new RegExp(`^${lastSale.chassisNumber?.trim()}$`, 'i') } },
                            ...(matchedUser ? [{ userId: matchedUser._id }] : []),
                            { userId: customer.googleId }
                        ],
                        bikeModel: lastSale.bikeName
                    },
                    {
                        $set: {
                            registrationNumber: registrationNumber,
                            registrationVerified: true
                        }
                    }
                );
            }
        }

        res.json({ success: true, data: customer });
    } catch (error: any) {
        console.error("Customer Update Error:", error);
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;
