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
            secure: process.env.NODE_ENV === 'production' || process.env.RENDER === 'true',
            sameSite: process.env.NODE_ENV === 'production' || process.env.RENDER === 'true' ? 'none' : 'lax',
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
            secure: process.env.NODE_ENV === 'production' || process.env.RENDER === 'true',
            sameSite: process.env.NODE_ENV === 'production' || process.env.RENDER === 'true' ? 'none' : 'lax',
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
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login` }),
    (req, res) => {
        const user = req.user as any;
        const token = generateToken(user._id as string);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' || process.env.RENDER === 'true',
            sameSite: process.env.NODE_ENV === 'production' || process.env.RENDER === 'true' ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        res.redirect(`${process.env.CLIENT_URL}/profile`);
    }
);

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', protect, (req: any, res) => {
    const userData = typeof req.user.toObject === 'function' ? req.user.toObject() : { ...req.user };
    userData.vaultPinSet = !!req.user.vaultPin;
    delete userData.password;
    delete userData.vaultPin;
    res.json({ success: true, data: userData });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req: any, res) => {
    try {
        const { displayName, email, phone } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
            user.email = email;
        }

        if (displayName) user.displayName = displayName;
        if (phone !== undefined) user.phone = phone;

        await user.save();
        res.json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req: any, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || process.env.RENDER === 'true',
        sameSite: process.env.NODE_ENV === 'production' || process.env.RENDER === 'true' ? 'none' : 'lax',
    });
    res.json({ success: true, message: 'Logged out' });
});

// @desc    Setup vault PIN
// @route   POST /api/auth/vault-setup
router.post('/vault-setup', protect, async (req: any, res) => {
    try {
        const { pin } = req.body;
        if (!pin || pin.length < 4) {
            return res.status(400).json({ success: false, message: 'Invalid PIN' });
        }
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.vaultPin = pin;
        await user.save();
        res.json({ success: true, message: 'Vault PIN setup complete' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Verify vault PIN
// @route   POST /api/auth/vault-verify
router.post('/vault-verify', protect, async (req: any, res) => {
    try {
        const { pin } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (!user.vaultPin) {
            return res.status(400).json({ success: false, message: 'Vault PIN not setup' });
        }

        const isMatch = await user.compareVaultPin(pin);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect PIN' });
        }

        res.json({ success: true, message: 'PIN verified' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
