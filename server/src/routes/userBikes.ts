import { Router } from 'express';
import UserBike from '../models/UserBike';
import { protect } from '../middleware/authMiddleware';
import { calculateNextService } from '../utils/serviceIntervals';
import Bike from '../models/Bike';
import Service from '../models/Service';

const router = Router();

// @desc    Get all bikes for the logged-in user
// @route   GET /api/user-bikes
router.get('/', protect, async (req: any, res) => {
    try {
        const bikes = await UserBike.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: bikes });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Add a new bike for the logged-in user
// @route   POST /api/user-bikes
router.post('/', protect, async (req: any, res) => {
    try {
        const { bikeId, bikeModel, registrationNumber, purchaseDate, lastServiceDate, mileage, serviceCount = 0 } = req.body;

        let finalBikeImage = "";
        let finalBikeModel = bikeModel;

        if (bikeId) {
            const officialBike = await Bike.findById(bikeId);
            if (officialBike) {
                finalBikeModel = officialBike.name;
                finalBikeImage = officialBike.colors[0]?.image || "";
            }
        }

        const { nextDate, nextKm } = calculateNextService(finalBikeModel, new Date(purchaseDate), serviceCount);
        console.log(`Calculated for ${finalBikeModel}: Next Date - ${nextDate}, Next KM - ${nextKm}`);

        const newBike = new UserBike({
            userId: req.user._id,
            bikeId: bikeId || null,
            bikeModel: finalBikeModel,
            bikeImage: finalBikeImage,
            registrationNumber,
            purchaseDate,
            lastServiceDate,
            nextServiceDate: nextDate,
            nextServiceKm: nextKm,
            mileage,
            serviceCount
        });

        await newBike.save();
        res.status(201).json({ success: true, data: newBike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Delete a bike
// @route   DELETE /api/user-bikes/:id
router.delete('/:id', protect, async (req: any, res) => {
    try {
        const bike = await UserBike.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }
        res.json({ success: true, message: 'Bike deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get service reminders for the logged-in user
// @route   GET /api/user-bikes/reminders
router.get('/reminders', protect, async (req: any, res) => {
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

// @desc    Get service log for a specific user bike
// @route   GET /api/user-bikes/:id/services
router.get('/:id/services', protect, async (req: any, res) => {
    try {
        const bike = await UserBike.findOne({ _id: req.params.id, userId: req.user._id });
        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }

        // Fetch services using registration number
        const services = await Service.find({
            regNumber: bike.registrationNumber
        }).sort({ createdAt: -1 });

        res.json({ success: true, data: services });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Update odometer reading
// @route   PATCH /api/user-bikes/:id/odometer
router.patch('/:id/odometer', protect, async (req: any, res) => {
    try {
        const { mileage } = req.body;
        const bike = await UserBike.findOne({ _id: req.params.id, userId: req.user._id });

        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }

        bike.mileage = mileage;
        await bike.save();

        res.json({ success: true, data: bike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
