import { Router } from 'express';
import WorkshopSlot from '../models/WorkshopSlot';

const router = Router();

// GET available slots for a specific date
router.get('/available', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ success: false, message: 'Date is required' });

        const slots = await WorkshopSlot.find({ date: date as string });
        res.json({ success: true, data: slots });
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
