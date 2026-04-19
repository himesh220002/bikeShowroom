import { Router } from 'express';
import WorkshopSlot from '../models/WorkshopSlot';
import Config from '../models/Config';

const router = Router();

// GET available slots for a specific date
router.get('/available', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ success: false, message: 'Date is required' });

        const slots = await WorkshopSlot.find({ date: date as string });

        // Get default capacity from config
        const defaultCapacityConfig = await Config.findOne({ key: 'workshop_default_capacity' });
        const defaultCapacity = defaultCapacityConfig ? Number(defaultCapacityConfig.value) : 5;

        // Ensure all slots returned have the correct capacity (if newly found or if we want to ensure consistency)
        const mappedSlots = slots.map(slot => ({
            ...slot.toObject(),
            capacity: slot.capacity ?? defaultCapacity
        }));

        res.json({ success: true, data: mappedSlots, defaultCapacity });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin: Set/Update capacity for a specific slot
router.put('/capacity', async (req, res) => {
    try {
        const { date, slotTime, capacity } = req.body;
        if (!date || !slotTime || capacity === undefined) {
            return res.status(400).json({ success: false, message: 'date, slotTime, and capacity are required' });
        }

        const slot = await WorkshopSlot.findOneAndUpdate(
            { date, slotTime },
            { $set: { capacity } },
            { upsert: true, new: true }
        );

        res.json({ success: true, data: slot });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
