import { Router } from 'express';
import passport from 'passport';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// @desc    Register new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { displayName, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            displayName,
            email,
            password,
            authProvider: 'local'
        });

        const token = generateToken(user._id as string);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!user) return res.status(401).json({ success: false, message: info.message || 'Login failed' });

        const token = generateToken(user._id as string);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({ success: true, data: user });
    })(req, res, next);
});

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const user = req.user as any;
        const token = generateToken(user._id as string);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        res.redirect('http://localhost:3000/profile');
    }
);

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', protect, (req: any, res) => {
    res.json({ success: true, data: req.user });
});

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req: any, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out' });
});

export default router;
