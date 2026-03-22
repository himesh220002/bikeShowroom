import { Router } from 'express';
import Lead from '../models/LeadReal';
import Customer from '../models/Customer';

const router = Router();

// Get all qualified leads
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find()
            .populate('customerId')
            .populate('inquiryIds')
            .sort({ updatedAt: -1 });
        res.json({ success: true, data: leads });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update lead stage
router.patch('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json({ success: true, data: lead });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
