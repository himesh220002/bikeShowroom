import { Router } from 'express';
import JobOpening from '../models/JobOpening';
import JobApplication from '../models/JobApplication';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer for resume uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../../client/public/resumes');
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

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only .pdf, .doc and .docx files are allowed'));
        }
    }
});

// --- Public Routes ---

// Get all active job openings
router.get('/openings', async (req, res) => {
    try {
        const openings = await JobOpening.find({ active: true }).sort({ createdAt: -1 });
        res.json({ success: true, data: openings });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Submit a job application
router.post('/apply', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, phone, jobId, aboutYourself, linkedInProfile } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Resume is required' });
        }

        const resumeUrl = `/resumes/${req.file.filename}`;

        const application = new JobApplication({
            name,
            email,
            phone,
            resumeUrl,
            aboutYourself,
            jobId,
            linkedInProfile
        });

        await application.save();
        res.status(201).json({ success: true, message: 'Application submitted successfully' });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// --- Admin Routes ---

// Get all job openings (including inactive)
router.get('/admin/openings', async (req, res) => {
    try {
        const openings = await JobOpening.find().sort({ createdAt: -1 });
        res.json({ success: true, data: openings });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new job opening
router.post('/admin/openings', async (req, res) => {
    try {
        const opening = new JobOpening(req.body);
        await opening.save();
        res.status(201).json({ success: true, data: opening });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update a job opening
router.put('/admin/openings/:id', async (req, res) => {
    try {
        const opening = await JobOpening.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!opening) return res.status(404).json({ success: false, message: 'Job opening not found' });
        res.json({ success: true, data: opening });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete a job opening
router.delete('/admin/openings/:id', async (req, res) => {
    try {
        const opening = await JobOpening.findByIdAndDelete(req.params.id);
        if (!opening) return res.status(404).json({ success: false, message: 'Job opening not found' });
        res.json({ success: true, message: 'Job opening deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all applications (Admin)
router.get('/admin/applications', async (req, res) => {
    try {
        const applications = await JobApplication.find()
            .populate('jobId', 'title')
            .sort({ appliedAt: -1 });
        res.json({ success: true, data: applications });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get unviewed applications count (Admin)
router.get('/admin/notifications/unread', async (req, res) => {
    try {
        const unreadCount = await JobApplication.countDocuments({ viewed: false });
        res.json({ success: true, count: unreadCount });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mark all applications as viewed (Admin)
router.post('/admin/applications/mark-viewed', async (req, res) => {
    try {
        await JobApplication.updateMany({ viewed: false }, { viewed: true });
        res.json({ success: true, message: 'Marked all as viewed' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update application status and ratings (Admin)
router.put('/admin/applications/:id/status', async (req, res) => {
    try {
        const { status, ratings, potentialTags, viewed } = req.body;
        if (status && !['applied', 'rejected', 'shortlisted', 'potential'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (ratings) updateData.ratings = ratings;
        if (potentialTags) updateData.potentialTags = potentialTags;
        if (viewed !== undefined) updateData.viewed = viewed;

        const application = await JobApplication.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        res.json({ success: true, data: application });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
