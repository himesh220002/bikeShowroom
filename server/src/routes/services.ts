import { Router } from 'express';
import Service from '../models/Service';
import Customer from '../models/Customer';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { name, phone, ...rest } = req.body;

        // 1. Upsert Customer
        let customer = await Customer.findOne({ phone });
        if (!customer) {
            customer = new Customer({ name, phone });
            await customer.save();
        }

        // 2. Create Service linked to Customer
        const service = new Service({
            ...rest,
            name,
            phone,
            customerId: customer._id
        });
        await service.save();

        // Emit to all connected admin dashboards
        const io = (req as any).io;
        if (io) {
            io.emit('new_service', service);
        }

        res.status(201).json({ success: true, data: service });
    } catch (error: any) {
        console.error("Error creating service booking:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const services = await Service.find().populate('customerId').sort({ createdAt: -1 });
        res.json({ success: true, data: services });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
