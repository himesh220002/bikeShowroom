import { Router } from 'express';
import Service from '../models/Service';
import Customer from '../models/Customer';
import WorkshopSlot from '../models/WorkshopSlot';
import Config from '../models/Config';
import Spare from '../models/Spare';
import UserBike from '../models/UserBike';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Get services for the logged-in user
router.get('/user', protect, async (req: any, res) => {
    try {
        const userPhone = req.user.phone;
        const userId = req.user._id;
        
        if (!userPhone) {
            return res.json({ success: true, data: [] });
        }

        // Find user's bikes to get registration numbers
        const userBikes = await UserBike.find({ userId });
        const regNumbers = userBikes.map(b => b.registrationNumber).filter(Boolean);

        const services = await Service.find({
            $or: [
                { phone: userPhone },
                { regNumber: { $in: regNumbers } }
            ]
        })
            .populate('customerId')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: services });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const updateStock = async (items: any[], direction: number) => {
    for (const item of items) {
        if (item.itemId) {
            await Spare.findByIdAndUpdate(item.itemId, {
                $inc: { stock: direction * (item.quantity || 1) }
            });
            // Update status based on new stock
            const updated = await Spare.findById(item.itemId);
            if (updated) {
                updated.status = updated.stock > 0 ? 'In Stock' : 'Out of Stock';
                await updated.save();
            }
        }
    }
};

router.post('/', async (req, res) => {
    try {
        const { name, phone, ...rest } = req.body;

        // 1. Upsert Customer
        let customer = await Customer.findOne({ phone });
        if (!customer) {
            customer = new Customer({ name, phone });
            await customer.save();
        }

        // 2. Compute service number and create instance for validation
        const { appointmentDate, appointmentTime, bikeModel } = rest;
        const priorCount = await Service.countDocuments({
            phone,
            bikeModel,
            status: { $nin: ['cancelled'] }
        });
        const serviceNumber = priorCount + 1;
        const autoBillingType: 'free' | 'paid' = serviceNumber <= 4 ? 'free' : 'paid';

        const { items, ...serviceData } = rest;
        let calculatedCost = rest.cost || 0;
        if (items && Array.isArray(items)) {
            calculatedCost = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        }

        const service = new Service({
            ...serviceData,
            name,
            phone,
            customerId: customer._id,
            serviceNumber,
            billingType: rest.billingType || autoBillingType,
            items: items || [],
            cost: calculatedCost
        });

        // 3. Explicit Validation (to prevent slot leakage if fields are missing)
        await service.validate();

        // 4. Manage Workshop Slot (only if validation passes)
        if (appointmentDate && appointmentTime) {
            const slot = await WorkshopSlot.findOne({ date: appointmentDate, slotTime: appointmentTime });
            const defaultCapacityConfig = await Config.findOne({ key: 'workshop_default_capacity' });
            const defaultCapacity = defaultCapacityConfig ? Number(defaultCapacityConfig.value) : 5;

            const capacity = slot?.capacity ?? defaultCapacity;
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

        // 5. Final Save
        await service.save();

        // 6. Update Item Stock
        if (items && items.length > 0) {
            await updateStock(items, -1);
        }

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

            // Increment stock back if items existed
            if (service.items && service.items.length > 0) {
                await updateStock(service.items, 1);
            }
        } else if (service.status === 'cancelled' && status !== 'cancelled') {
            // Re-activating a cancelled service - Check Capacity First
            const slot = await WorkshopSlot.findOne({ date: service.appointmentDate, slotTime: service.appointmentTime });

            const defaultCapacityConfig = await Config.findOne({ key: 'workshop_default_capacity' });
            const defaultCapacity = defaultCapacityConfig ? Number(defaultCapacityConfig.value) : 5;

            const capacity = slot?.capacity ?? defaultCapacity;
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
                (customer as any).lifetimeValue = ((customer as any).lifetimeValue || 0) + billAmount;
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
        const { name, phone, items, ...updateData } = req.body;
        const updateFields: any = { ...updateData };
        if (name !== undefined) updateFields.name = name;
        if (phone !== undefined) updateFields.phone = phone;
        if (items !== undefined) {
            updateFields.items = items;
            // Re-calculate cost if items are provided and cost is not explicitly set
            if (req.body.cost === undefined) {
                updateFields.cost = items.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0);
            }
        }

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

            const defaultCapacityConfig = await Config.findOne({ key: 'workshop_default_capacity' });
            const defaultCapacity = defaultCapacityConfig ? Number(defaultCapacityConfig.value) : 5;

            const capacity = slot?.capacity ?? defaultCapacity;
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

router.post('/:id/rate', protect, async (req: any, res) => {
    try {
        const { rating, feedback } = req.body;
        const userPhone = req.user.phone;

        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

        // Security check: Only the customer who booked the service OR the owner of the registered bike can rate it
        let isAuthorized = service.phone === userPhone;

        if (!isAuthorized && service.regNumber) {
            const userBike = await UserBike.findOne({
                userId: req.user._id,
                registrationNumber: service.regNumber
            });
            if (userBike) isAuthorized = true;
        }

        if (!isAuthorized) {
            return res.status(403).json({ success: false, message: 'Unauthorized.' });
        }

        if (rating !== undefined) {
            if (rating < 0 || rating > 10) {
                return res.status(400).json({ success: false, message: 'Invalid rating. Must be 0-10.' });
            }
            service.rating = Number(rating);
            service.ratedAt = new Date();
        }

        if (feedback !== undefined) {
            service.feedback = feedback;
            service.feedbackAt = new Date();
        }

        await service.save();

        res.json({ success: true, data: service });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
