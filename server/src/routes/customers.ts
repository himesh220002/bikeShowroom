import { Router } from 'express';
import Customer from '../models/Customer';
import Sale from '../models/Sale';
import Service from '../models/Service';

const router = Router();

// Fetch all customers with their purchase and service history for the CRM
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });

        const enhancedCustomers = await Promise.all(customers.map(async (customer) => {
            // Find last sale for this customer
            const lastSale = await Sale.findOne({ customerId: customer._id }).sort({ createdAt: -1 });

            // Find service count (completed services)
            const serviceCount = await Service.countDocuments({ customerId: customer._id, status: 'completed' });

            // Find latest service
            const latestService = await Service.findOne({ customerId: customer._id }).sort({ createdAt: -1 });

            // Dynamic Service Tracker Logic
            let serviceMilestone = "N/A";
            let nextServiceDue = null;
            let isFreeService = false;

            if (lastSale) {
                const purchaseDate = new Date(lastSale.createdAt);
                // logic: 1st: 30, 2nd: 150, 3rd: 270, 4th: 390 -> 30 + (n * 120)
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
                lastSale: lastSale ? {
                    bikeName: lastSale.bikeName,
                    variant: lastSale.variant,
                    salePrice: lastSale.salePrice,
                    saleDate: lastSale.createdAt
                } : null,
                serviceHistory: {
                    totalCount: serviceCount,
                    latest: latestService ? {
                        status: latestService.status,
                        date: latestService.createdAt
                    } : null
                }
            };
        }));

        res.json({
            success: true,
            data: enhancedCustomers.filter(c => c.lastSale !== null) // Only show actual customers in CRM
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

        res.json({ success: true, data: customer });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;
