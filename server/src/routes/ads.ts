import { Router } from 'express';
import Ad from '../models/Ad';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/uploads/ads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all campaigns
router.get('/', async (req, res) => {
    try {
        let ads = await Ad.find();
        const now = new Date();
        const currentMonth = now.toLocaleString('en-US', { month: 'long' });
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonthIndex = now.getMonth();

        // 1. Auto-transition status based on dates
        const updatedAds = await Promise.all(ads.map(async (ad) => {
            let status = ad.status;
            let changed = false;

            if (ad.startDate && ad.endDate) {
                if (now < ad.startDate) {
                    if (status !== 'Scheduled') { status = 'Scheduled'; changed = true; }
                } else if (now > ad.endDate) {
                    if (status !== 'Inactive') { status = 'Inactive'; changed = true; }
                } else {
                    if (status !== 'Active') { status = 'Active'; changed = true; }
                }
            }

            if (changed) {
                ad.status = status;
                await ad.save();
            }
            return ad;
        }));

        // 2. Complex Sorting
        // - Sort by month relevance (current month first, circular)
        // - Within month, sort by status (Active > Scheduled > Inactive)
        // - Then by priority
        const sortedAds = updatedAds.sort((a: any, b: any) => {
            const getMonthIdx = (m?: string) => m ? months.indexOf(m) : -1;
            const aMonthIdx = getMonthIdx(a.month);
            const bMonthIdx = getMonthIdx(b.month);

            // Circular distance from current month
            const getDist = (idx: number) => {
                if (idx === -1) return 100; // No month set
                return (idx - currentMonthIndex + 12) % 12;
            };

            const aDist = getDist(aMonthIdx);
            const bDist = getDist(bMonthIdx);

            if (aDist !== bDist) return aDist - bDist;

            // Status Priority
            const statusOrder = { 'Active': 0, 'Scheduled': 1, 'Inactive': 2 };
            const aStatus = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
            const bStatus = statusOrder[b.status as keyof typeof statusOrder] ?? 3;

            if (aStatus !== bStatus) return aStatus - bStatus;

            return (a.priority || 0) - (b.priority || 0);
        });

        res.json({ success: true, data: sortedAds });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new campaign with image upload
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, type, link, status, description, month, startDate, endDate } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        // Return path relative to server's static folder
        const imagePath = `/uploads/ads/${req.file.filename}`;

        const adCount = await Ad.countDocuments();

        const ad = new Ad({
            name,
            type,
            link,
            status,
            description,
            month,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            image: imagePath,
            impact: '0',
            priority: adCount
        });

        await ad.save();
        res.status(201).json({ success: true, data: ad });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Reorder campaigns
router.post('/reorder', async (req, res) => {
    try {
        const { ads } = req.body; // Array of { _id, priority }
        if (!ads || !Array.isArray(ads)) {
            return res.status(400).json({ success: false, message: 'Ads array is required' });
        }

        const bulkOps = ads.map((item: any) => ({
            updateOne: {
                filter: { _id: item._id },
                update: { priority: item.priority }
            }
        }));

        await Ad.bulkWrite(bulkOps);
        res.json({ success: true, message: 'Priority updated successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update campaign
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, type, link, status, description, month, startDate, endDate } = req.body;
        const updateData: any = {
            name,
            type,
            link,
            status,
            description,
            month,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        };

        if (req.file) {
            // New image uploaded
            updateData.image = `/images/ads/${req.file.filename}`;

            // Cleanup old image
            const oldAd = await Ad.findById(req.params.id);
            if (oldAd && oldAd.image && oldAd.image.startsWith('/uploads/')) {
                const oldPath = path.join(__dirname, '../../public', oldAd.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        const ad = await Ad.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
        res.json({ success: true, data: ad });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete campaign
router.delete('/:id', async (req, res) => {
    try {
        const ad = await Ad.findByIdAndDelete(req.params.id);
        if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });

        // Cleanup the physical file
        const filePath = path.join(__dirname, '../../../client/public', ad.image);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ success: true, message: 'Ad deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
