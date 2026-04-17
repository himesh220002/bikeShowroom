import { Router } from 'express';
import UserBike from '../models/UserBike';
import { protect } from '../middleware/authMiddleware';
import { calculateNextService } from '../utils/serviceIntervals';
import Bike from '../models/Bike';
import Service from '../models/Service';
import Sale from '../models/Sale';
import Customer from '../models/Customer';

const router = Router();

// @desc    Get all bikes for the logged-in user
// @route   GET /api/user-bikes
router.get('/', protect, async (req: any, res) => {
    try {
        const bikes = await UserBike.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: bikes });
    } catch (error: any) {
        console.error("Error in GET /api/user-bikes:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Add a new bike for the logged-in user
// @route   POST /api/user-bikes
router.post('/', protect, async (req: any, res) => {
    try {
        const { bikeId, bikeModel, registrationNumber, chassisNumber, purchaseDate, lastServiceDate, mileage, serviceCount = 0 } = req.body;

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
            chassisNumber,
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

        // Update consumables logic estimation based on mileage increase
        if (bike.lastMileage) {
            const diff = mileage - bike.lastMileage;
            if (diff > 0) {
                // Crude estimation: every 1000km reduces health by a bit
                bike.consumables.tires = Math.max(0, bike.consumables.tires - (diff / 100));
                bike.consumables.chain = Math.max(0, bike.consumables.chain - (diff / 50));
                bike.consumables.brakes = Math.max(0, bike.consumables.brakes - (diff / 80));
                // Recalculate condition score
                bike.conditionScore = Math.round((bike.consumables.tires + bike.consumables.chain + bike.consumables.brakes + bike.consumables.coolant) / 4);
            }
        }
        bike.lastMileage = mileage;

        await bike.save();

        res.json({ success: true, data: bike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Update bike details (registration plate, chassis, etc)
// @route   PUT /api/user-bikes/:id
router.put('/:id', protect, async (req: any, res) => {
    try {
        const bike = await UserBike.findOne({ _id: req.params.id, userId: req.user._id });
        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }

        const updates = req.body;
        delete updates.userId; // Prevent changing ownership
        delete updates._id;

        Object.assign(bike, updates);
        await bike.save();

        res.json({ success: true, data: bike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Add modification
// @route   POST /api/user-bikes/:id/modifications
router.post('/:id/modifications', protect, async (req: any, res) => {
    try {
        const { partName, brand, cost, date, location } = req.body;
        const bike = await UserBike.findOne({ _id: req.params.id, userId: req.user._id });

        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }

        bike.modifications.push({ partName, brand, cost, date, location });
        await bike.save();

        res.json({ success: true, data: bike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Add document
// @route   POST /api/user-bikes/:id/documents
router.post('/:id/documents', protect, async (req: any, res) => {
    try {
        const { docType, docUrl, expiryDate } = req.body;
        const bike = await UserBike.findOne({ _id: req.params.id, userId: req.user._id });

        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }

        bike.documents.push({ docType, docUrl, expiryDate });

        if (docType.toLowerCase() === 'insurance') {
            bike.insuranceExpiry = expiryDate;
        }

        await bike.save();

        res.json({ success: true, data: bike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Lookup bike by registration or chassis number
// @route   POST /api/user-bikes/connect-lookup
router.post('/connect-lookup', protect, async (req: any, res) => {
    try {
        const { registrationNumber, chassisNumber } = req.body;
        if (!registrationNumber && !chassisNumber) {
            return res.status(400).json({ success: false, message: 'Identity required (Reg/Chassis)' });
        }

        let saleFound = null;
        let serviceFound = null;

        if (chassisNumber) {
            saleFound = await Sale.findOne({ chassisNumber });
        }

        if (registrationNumber) {
            serviceFound = await Service.findOne({ regNumber: registrationNumber }).sort({ createdAt: -1 });
            if (!saleFound) {
                // Try finding sale by reg number if we had it there (Sale doesn't have it, but maybe we can link via customer?)
                // Sale doesn't have regNumber, but it has chassisNumber.
            }
        }

        // Return found details
        let bikeId = saleFound?.bikeId || "";

        // If no bikeId from sale, try to find by model name in official catalog
        if (!bikeId) {
            const modelName = saleFound?.bikeName || serviceFound?.bikeModel;
            if (modelName) {
                const officialBike = await Bike.findOne({ name: modelName });
                if (officialBike) {
                    bikeId = officialBike._id;
                }
            }
        }

        const details = {
            bikeId: bikeId || "",
            bikeModel: saleFound?.bikeName || serviceFound?.bikeModel || "",
            purchaseDate: saleFound?.saleDate || null,
            registrationNumber: registrationNumber || "",
            chassisNumber: chassisNumber || saleFound?.chassisNumber || "",
            lastServiceDate: serviceFound?.appointmentDate || null,
            serviceCount: serviceFound?.serviceNumber || 0,
            foundInSystem: !!(saleFound || serviceFound)
        };

        res.json({ success: true, data: details });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
