import { Router } from 'express';
import Ad from '../models/Ad';

const router = Router();

// Get all campaigns
router.get('/', async (req, res) => {
    try {
        const ads = await Ad.find().sort({ createdAt: -1 });
        res.json({ success: true, data: ads });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new campaign
router.post('/', async (req, res) => {
    try {
        const ad = new Ad(req.body);
        await ad.save();
        res.status(201).json({ success: true, data: ad });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;
