import { Router } from 'express';
import Ad from '../models/Ad';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../../client/public/images/ads');
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
        const ads = await Ad.find().sort({ priority: 1, createdAt: -1 });
        res.json({ success: true, data: ads });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new campaign with image upload
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, type, link, status, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        // Return path relative to client's public folder
        const imagePath = `/images/ads/${req.file.filename}`;

        const adCount = await Ad.countDocuments();

        const ad = new Ad({
            name,
            type,
            link,
            status,
            description,
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
        const { name, type, link, status, description } = req.body;
        const updateData: any = { name, type, link, status, description };

        if (req.file) {
            // New image uploaded
            updateData.image = `/images/ads/${req.file.filename}`;

            // Cleanup old image
            const oldAd = await Ad.findById(req.params.id);
            if (oldAd && oldAd.image) {
                const oldPath = path.join(__dirname, '../../../client/public', oldAd.image);
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
