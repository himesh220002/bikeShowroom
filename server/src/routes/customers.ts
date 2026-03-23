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

            // Find service count
            const serviceCount = await Service.countDocuments({ customerId: customer._id });

            // Find latest service
            const latestService = await Service.findOne({ customerId: customer._id }).sort({ createdAt: -1 });

            return {
                ...customer.toObject(),
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

export default router;
