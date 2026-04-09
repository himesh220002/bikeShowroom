import { Router } from 'express';
import Notification from '../models/Notification';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Get notifications for the logged-in user
router.get('/', protect, async (req: any, res) => {
    try {
        const userPhone = req.user.phone;
        if (!userPhone) {
            return res.json({ success: true, data: [] });
        }

        const notifications = await Notification.find({ userPhone })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ success: true, data: notifications });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, data: notification });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mark all as read
router.put('/read-all', protect, async (req: any, res) => {
    try {
        const userPhone = req.user.phone;
        if (!userPhone) return res.status(400).json({ success: false, message: 'User phone not found' });

        await Notification.updateMany(
            { userPhone, isRead: false },
            { isRead: true }
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
