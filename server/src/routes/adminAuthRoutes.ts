import { Router } from 'express';
import { loginAdmin, changeAdminPassword } from '../controllers/adminAuthController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// @desc    Login admin
// @route   POST /api/admin/auth/login
router.post('/login', loginAdmin);

// @desc    Change admin password
// @route   POST /api/admin/auth/change-password
// Note: In a real app, this should be protected. 
// For this showroom app, we'll use our existing middleware if available.
router.post('/change-password', protect, adminOnly, changeAdminPassword);

export default router;
