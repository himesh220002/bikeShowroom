import { Router } from 'express';
import Service from '../models/Service';
import Customer from '../models/Customer';
import WorkshopSlot from '../models/WorkshopSlot';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Get services for the logged-in user
router.get('/user', protect, async (req: any, res) => {
    try {
        const userPhone = req.user.phone;
        if (!userPhone) {
            return res.json({ success: true, data: [] });
        }

        const services = await Service.find({ phone: userPhone })
            .populate('customerId')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: services });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, phone, ...rest } = req.body;

        // 1. Upsert Customer
        let customer = await Customer.findOne({ phone });
        if (!customer) {
            customer = new Customer({ name, phone });
            await customer.save();
        }

        // 2. Manage Workshop Slot with Overbooking Protection
        const { appointmentDate, appointmentTime, bikeModel } = rest;
        if (appointmentDate && appointmentTime) {
            const slot = await WorkshopSlot.findOne({ date: appointmentDate, slotTime: appointmentTime });
            const capacity = slot?.capacity ?? 5;
            const bookedCount = slot?.bookedCount ?? 0;

            if (bookedCount >= capacity) {
                return res.status(400).json({
                    success: false,
                    message: `Workshop slot at ${appointmentTime} on ${appointmentDate} is fully booked.`
                });
            }

            await WorkshopSlot.findOneAndUpdate(
                { date: appointmentDate, slotTime: appointmentTime },
                { $inc: { bookedCount: 1 } },
                { upsert: true, new: true }
            );
        }

        // 3. Compute service number for this phone + bikeModel combo
        //    Count all prior services (non-cancelled) to determine the sequence number
        const priorCount = await Service.countDocuments({
            phone,
            bikeModel,
            status: { $nin: ['cancelled'] }
        });
        const serviceNumber = priorCount + 1;

        // Services 1–4 are complimentary (free), 5+ are paid.
        // Admin can always override from the Full Job Edit form.
        const autoBillingType: 'free' | 'paid' = serviceNumber <= 4 ? 'free' : 'paid';

        // 4. Create Service linked to Customer
        const service = new Service({
            ...rest,
            name,
            phone,
            customerId: customer._id,
            serviceNumber,
            billingType: rest.billingType || autoBillingType
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

        // Reset priority to Normal if completed or delivered
        if (['completed', 'delivered'].includes(status)) {
            updateData.priority = 'Normal';
        }

        // Update Workshop Slot if cancelled
        if (status === 'cancelled' && service.status !== 'cancelled') {
            await WorkshopSlot.findOneAndUpdate(
                { date: service.appointmentDate, slotTime: service.appointmentTime },
                { $inc: { bookedCount: -1 } }
            );
        } else if (service.status === 'cancelled' && status !== 'cancelled') {
            // Re-activating a cancelled service - Check Capacity First
            const slot = await WorkshopSlot.findOne({ date: service.appointmentDate, slotTime: service.appointmentTime });
            const capacity = slot?.capacity ?? 5;
            const bookedCount = slot?.bookedCount ?? 0;

            if (bookedCount >= capacity) {
                return res.status(400).json({
                    success: false,
                    message: `Workshop slot at ${service.appointmentTime} on ${service.appointmentDate} is now full. Cannot re-activate.`
                });
            }

            await WorkshopSlot.findOneAndUpdate(
                { date: service.appointmentDate, slotTime: service.appointmentTime },
                { $inc: { bookedCount: 1 } },
                { upsert: true }
            );
        }

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

        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

        // Handle Rescheduling
        const dateChanged = updateData.appointmentDate && updateData.appointmentDate !== service.appointmentDate;
        const timeChanged = updateData.appointmentTime && updateData.appointmentTime !== service.appointmentTime;

        if ((dateChanged || timeChanged) && service.status !== 'cancelled') {
            const nextDate = updateData.appointmentDate || service.appointmentDate;
            const nextTime = updateData.appointmentTime || service.appointmentTime;

            // Check Capacity in New Slot
            const slot = await WorkshopSlot.findOne({ date: nextDate, slotTime: nextTime });
            const capacity = slot?.capacity ?? 5;
            const bookedCount = slot?.bookedCount ?? 0;

            if (bookedCount >= capacity) {
                return res.status(400).json({
                    success: false,
                    message: `Target workshop slot at ${nextTime} on ${nextDate} is already full.`
                });
            }

            // Decrement from old slot
            await WorkshopSlot.findOneAndUpdate(
                { date: service.appointmentDate, slotTime: service.appointmentTime },
                { $inc: { bookedCount: -1 } }
            );
            // Increment in new slot
            await WorkshopSlot.findOneAndUpdate(
                { date: nextDate, slotTime: nextTime },
                { $inc: { bookedCount: 1 } },
                { upsert: true }
            );
        }

        // Apply updates
        Object.assign(service, updateFields);

        // Reset priority to Normal if completed or delivered
        if (['completed', 'delivered'].includes(service.status)) {
            service.priority = 'Normal';
        }

        await service.save();
        await service.populate('customerId');

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
