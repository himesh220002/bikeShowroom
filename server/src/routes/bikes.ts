import { Router } from 'express';
import Bike from '../models/Bike';

const router = Router();

// Get all bikes with stock
router.get('/', async (req, res) => {
    try {
        const bikes = await Bike.find().sort({ name: 1 });
        res.json({ success: true, data: bikes });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
