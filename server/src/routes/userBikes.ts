import { Router } from 'express';
import UserBike from '../models/UserBike';
import { Schema } from 'mongoose';

const router = Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ success: false, message: 'Not authenticated' });
};

// @desc    Get all bikes for the logged-in user
// @route   GET /api/user-bikes
router.get('/', isAuthenticated, async (req: any, res) => {
    try {
        const bikes = await UserBike.find({ userId: req.user._id });
        res.json({ success: true, data: bikes });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Add a new bike for the logged-in user
// @route   POST /api/user-bikes
router.post('/', isAuthenticated, async (req: any, res) => {
    try {
        const { bikeModel, registrationNumber, purchaseDate, lastServiceDate, mileage } = req.body;

        // Simple next service date calculation (e.g., 6 months after last service or 3 months after purchase)
        let nextServiceDate = new Date(purchaseDate);
        if (lastServiceDate) {
            nextServiceDate = new Date(lastServiceDate);
            nextServiceDate.setMonth(nextServiceDate.getMonth() + 6);
        } else {
            nextServiceDate.setMonth(nextServiceDate.getMonth() + 3);
        }

        const newBike = new UserBike({
            userId: req.user._id,
            bikeModel,
            registrationNumber,
            purchaseDate,
            lastServiceDate,
            nextServiceDate,
            mileage
        });

        await newBike.save();
        res.status(201).json({ success: true, data: newBike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get service reminders for the logged-in user
// @route   GET /api/user-bikes/reminders
router.get('/reminders', isAuthenticated, async (req: any, res) => {
    try {
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);

        const reminders = await UserBike.find({
            userId: req.user._id,
            nextServiceDate: { $gte: today, $lte: nextMonth }
        });

        res.json({ success: true, data: reminders });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
