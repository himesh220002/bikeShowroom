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
        const ads = await Ad.find().sort({ createdAt: -1 });
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

        const ad = new Ad({
            name,
            type,
            link,
            status,
            description,
            image: imagePath,
            impact: '0'
        });

        await ad.save();
        res.status(201).json({ success: true, data: ad });
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
