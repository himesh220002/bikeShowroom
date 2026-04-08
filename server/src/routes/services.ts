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

// Update service status and timestamps
router.put('/:id/status', async (req, res) => {
    try {
        const { status, technicianName, cost } = req.body;
        const updateData: any = { status };

        if (technicianName) updateData.technicianName = technicianName;
        if (req.body.estimatedCompletionTime) updateData.estimatedCompletionTime = req.body.estimatedCompletionTime;
        if (cost !== undefined) updateData.cost = Number(cost);

        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

        // Automatically set the correct timestamp based on the new status
        if (status === 'in-progress' && !service.startedAt) updateData.startedAt = new Date();
        if (status === 'completed' && !service.completedAt) updateData.completedAt = new Date();
        if (status === 'delivered' && !service.deliveredAt) updateData.deliveredAt = new Date();

        // Update Customer LTV if transitioning to a final state for the first time
        const isFinalStatus = ['completed', 'delivered'].includes(status);
        const wasFinalStatus = ['completed', 'delivered'].includes(service.status);

        if (isFinalStatus && !wasFinalStatus) {
            const customer = await Customer.findById(service.customerId);
            if (customer) {
                const billAmount = cost !== undefined ? Number(cost) : (service.cost || 0);
                customer.lifetimeValue = (customer.lifetimeValue || 0) + billAmount;
                await customer.save();
            }
        }

        // Update basic fields
        Object.assign(service, updateData);

        // Push to status history if it exists
        if (!service.statusHistory) service.statusHistory = [];
        service.statusHistory.push({
            status,
            timestamp: new Date(),
            notes: req.body.notes || `Status updated to ${status}`
        });

        await service.save();
        await service.populate('customerId');

        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

        // Emit update to all connected admin dashboards
        const io = (req as any).io;
        if (io) {
            io.emit('service_updated', service);
        }

        res.json({ success: true, data: service });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update full service details
router.put('/:id', async (req, res) => {
    try {
        const { name, phone, ...updateData } = req.body;
        const updateFields: any = { ...updateData };
        if (name !== undefined) updateFields.name = name;
        if (phone !== undefined) updateFields.phone = phone;

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        ).populate('customerId');

        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

        // Emit update to all connected admin dashboards
        const io = (req as any).io;
        if (io) {
            io.emit('service_updated', service);
        }

        res.json({ success: true, data: service });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
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
