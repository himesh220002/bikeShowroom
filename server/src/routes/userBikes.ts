import { Router } from 'express';
import UserBike from '../models/UserBike';
import { protect } from '../middleware/authMiddleware';
import { calculateNextService } from '../utils/serviceIntervals';
import Bike from '../models/Bike';
import Service from '../models/Service';
import Sale from '../models/Sale';
import Customer from '../models/Customer';

const router = Router();

const defaultPartStatuses = () => ([
    { part: 'engine', status: 'healthy', note: 'No unusual noise', updatedAt: new Date() },
    { part: 'brakes', status: 'healthy', note: 'Brake bite stable', updatedAt: new Date() },
    { part: 'electrical', status: 'healthy', note: 'All lights and sensors working', updatedAt: new Date() },
    { part: 'connectivity', status: 'watch', note: 'Intermittent app reconnect', updatedAt: new Date() }
]);

const ensureDynamicDefaults = (bike: any) => {
    if (!Array.isArray(bike.partStatuses) || bike.partStatuses.length === 0) {
        bike.partStatuses = defaultPartStatuses();
    }
    if (!Array.isArray(bike.issueReports)) {
        bike.issueReports = [];
    }
    if (!Array.isArray(bike.diagnosticReports) || bike.diagnosticReports.length === 0) {
        bike.diagnosticReports = [{
            title: 'Baseline Health Scan',
            summary: 'Initial automated health baseline. Update this after every major service.',
            healthScore: bike.conditionScore || 100,
            generatedAt: new Date()
        }];
    }
    if (!Array.isArray(bike.rideAnalytics) || bike.rideAnalytics.length === 0) {
        bike.rideAnalytics = [{
            periodLabel: 'Last 30 Days',
            distanceKm: 0,
            efficiencyKmpl: 0,
            activeHours: 0,
            generatedAt: new Date()
        }];
    }
};

const parseSalePrice = (rawPrice: string | number | undefined) => {
    if (typeof rawPrice === 'number') return rawPrice;
    if (!rawPrice) return 0;
    const parsed = Number(String(rawPrice).replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
};

// @desc    Get all bikes for the logged-in user
// @route   GET /api/user-bikes
router.get('/', protect, async (req: any, res) => {
    try {
        const bikes = await UserBike.find({ userId: req.user._id }).sort({ createdAt: -1 });
        await Promise.all(bikes.map(async (bike: any) => {
            ensureDynamicDefaults(bike);
            const sale = await Sale.findOne({
                $or: [
                    ...(bike.chassisNumber ? [{ chassisNumber: bike.chassisNumber }] : []),
                    ...(bike.registrationNumber ? [{ registrationNumber: bike.registrationNumber }] : [])
                ]
            }).sort({ createdAt: -1 });

            if (sale) {
                if ((!bike.salePrice || bike.salePrice <= 0) && sale.salePrice) {
                    bike.salePrice = parseSalePrice(sale.salePrice);
                }
                if (!bike.chassisNumber && sale.chassisNumber) {
                    bike.chassisNumber = sale.chassisNumber;
                    bike.identitySource = 'sale_ledger';
                }
                if (!bike.registrationNumber && sale.registrationNumber) {
                    bike.registrationNumber = sale.registrationNumber;
                    bike.identitySource = 'sale_ledger';
                }
            }
            await bike.save();
        }));
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

        // Inherit registration from Sale if available
        let finalReg = registrationNumber;
        let regVerified = false;
        let finalSalePrice = 0;
        let identitySource: 'owner' | 'sale_ledger' = 'owner';
        if (chassisNumber) {
            const sale = await Sale.findOne({ chassisNumber });
            if (sale && sale.registrationNumber) {
                finalReg = sale.registrationNumber;
                regVerified = sale.registrationVerified || false;
                identitySource = 'sale_ledger';
            }
            if (sale?.salePrice) {
                finalSalePrice = parseSalePrice(sale.salePrice);
            }
        }
        if (!finalSalePrice && registrationNumber) {
            const saleByReg = await Sale.findOne({ registrationNumber }).sort({ createdAt: -1 });
            if (saleByReg?.salePrice) {
                finalSalePrice = parseSalePrice(saleByReg.salePrice);
            }
        }

        const newBike = new UserBike({
            userId: req.user._id,
            bikeId: bikeId || null,
            bikeModel: finalBikeModel,
            bikeImage: finalBikeImage,
            registrationNumber: finalReg,
            registrationVerified: regVerified,
            chassisNumber,
            identitySource,
            salePrice: finalSalePrice || undefined,
            purchaseDate,
            lastServiceDate,
            nextServiceDate: nextDate,
            nextServiceKm: nextKm,
            mileage,
            serviceCount,
            partStatuses: defaultPartStatuses(),
            diagnosticReports: [{
                title: 'Baseline Health Scan',
                summary: 'Initial automated health baseline. Update this after every major service.',
                healthScore: 100,
                generatedAt: new Date()
            }],
            rideAnalytics: [{
                periodLabel: 'Last 30 Days',
                distanceKm: 0,
                efficiencyKmpl: 0,
                activeHours: 0,
                generatedAt: new Date()
            }]
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

        // Prevent modification of verified registration by non-admins
        if (bike.registrationVerified && updates.registrationNumber && updates.registrationNumber !== bike.registrationNumber) {
            if (!req.user.isAdmin) { // Assuming req.user.isAdmin exists in protect middleware logic or handled by role
                return res.status(403).json({ success: false, message: 'Registration is verified and locked by showroom' });
            }
        }

        Object.assign(bike, updates);
        await bike.save();

        res.json({ success: true, data: bike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Update bike details by chassis number (Admin use)
// @route   PUT /api/user-bikes/by-chassis/:chassisNumber
router.put('/by-chassis/:chassisNumber', protect, async (req: any, res) => {
    try {
        const bike = await UserBike.findOne({ chassisNumber: req.params.chassisNumber });
        if (!bike) {
            return res.status(404).json({ success: false, message: 'No user bike record found for this chassis number' });
        }

        const { registrationNumber } = req.body;
        if (registrationNumber) {
            bike.registrationNumber = registrationNumber;
            bike.registrationVerified = true;
        }

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

// @desc    Upsert status for a bike part (owner observation)
// @route   PATCH /api/user-bikes/:id/part-status
router.patch('/:id/part-status', protect, async (req: any, res) => {
    try {
        const { part, status, note } = req.body;
        const bike: any = await UserBike.findOne({ _id: req.params.id, userId: req.user._id });
        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }
        if (!part || !status) {
            return res.status(400).json({ success: false, message: 'part and status are required' });
        }

        ensureDynamicDefaults(bike);

        const existing = bike.partStatuses.find((item: any) => item.part.toLowerCase() === String(part).toLowerCase());
        if (existing) {
            existing.status = status;
            existing.note = note || existing.note;
            existing.updatedAt = new Date();
        } else {
            bike.partStatuses.push({ part, status, note, updatedAt: new Date() });
        }

        await bike.save();
        res.json({ success: true, data: bike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Add bike issue report (noticed by owner)
// @route   POST /api/user-bikes/:id/issues
router.post('/:id/issues', protect, async (req: any, res) => {
    try {
        const { title, system, severity = 'medium', note } = req.body;
        const bike: any = await UserBike.findOne({ _id: req.params.id, userId: req.user._id });
        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }
        if (!title || !system) {
            return res.status(400).json({ success: false, message: 'title and system are required' });
        }

        ensureDynamicDefaults(bike);
        bike.issueReports.unshift({
            title,
            system,
            severity,
            status: 'open',
            observedAt: new Date(),
            note
        });
        await bike.save();
        res.json({ success: true, data: bike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Update issue status after repair/inspection
// @route   PATCH /api/user-bikes/:id/issues/:issueId
router.patch('/:id/issues/:issueId', protect, async (req: any, res) => {
    try {
        const { status, note } = req.body;
        const bike: any = await UserBike.findOne({ _id: req.params.id, userId: req.user._id });
        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }

        ensureDynamicDefaults(bike);
        const issue = bike.issueReports.id(req.params.issueId);
        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue not found' });
        }

        issue.status = status || issue.status;
        issue.note = note || issue.note;
        if (status === 'fixed') {
            issue.fixedAt = new Date();
        }
        await bike.save();
        res.json({ success: true, data: bike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Add diagnostic report
// @route   POST /api/user-bikes/:id/diagnostics
router.post('/:id/diagnostics', protect, async (req: any, res) => {
    try {
        const { title, summary, healthScore } = req.body;
        const bike: any = await UserBike.findOne({ _id: req.params.id, userId: req.user._id });
        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }
        if (!title || !summary) {
            return res.status(400).json({ success: false, message: 'title and summary are required' });
        }

        ensureDynamicDefaults(bike);
        bike.diagnosticReports.unshift({
            title,
            summary,
            healthScore: typeof healthScore === 'number' ? healthScore : bike.conditionScore || 100,
            generatedAt: new Date()
        });
        if (typeof healthScore === 'number') {
            bike.conditionScore = Math.max(0, Math.min(100, healthScore));
        }
        await bike.save();
        res.json({ success: true, data: bike });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Add riding analytics snapshot
// @route   POST /api/user-bikes/:id/ride-analytics
router.post('/:id/ride-analytics', protect, async (req: any, res) => {
    try {
        const { periodLabel = 'Last 30 Days', distanceKm, efficiencyKmpl, activeHours, odometerKm } = req.body;
        const bike: any = await UserBike.findOne({ _id: req.params.id, userId: req.user._id });
        if (!bike) {
            return res.status(404).json({ success: false, message: 'Bike not found' });
        }

        const parsedDistance = Number(distanceKm) || 0;
        const parsedOdometer = Number(odometerKm) || 0;

        ensureDynamicDefaults(bike);
        bike.rideAnalytics.unshift({
            periodLabel,
            distanceKm: parsedDistance,
            efficiencyKmpl: Number(efficiencyKmpl) || 0,
            activeHours: Number(activeHours) || 0,
            generatedAt: new Date()
        });
        bike.rideAnalytics = bike.rideAnalytics.slice(0, 12);

        // Keep odometer and analytics consistent.
        if (parsedOdometer > 0) {
            bike.mileage = parsedOdometer;
            bike.lastMileage = parsedOdometer;
        } else if ((!bike.mileage || bike.mileage === 0) && parsedDistance > 0) {
            // Backward compatible fallback for old forms that don't send odometer yet.
            bike.mileage = parsedDistance;
            bike.lastMileage = parsedDistance;
        }

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
            if (!saleFound) {
                saleFound = await Sale.findOne({ registrationNumber }).sort({ createdAt: -1 });
            }
            serviceFound = await Service.findOne({ regNumber: registrationNumber }).sort({ createdAt: -1 });
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
            registrationNumber: registrationNumber || saleFound?.registrationNumber || "",
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
