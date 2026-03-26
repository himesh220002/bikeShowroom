import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        const user = req.user as any;
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        // Redirect to profile with token (or set cookie)
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('http://localhost:3000/profile');
    }
);

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ success: true, data: req.user });
    } else {
        res.status(401).json({ success: false, message: 'Not authenticated' });
    }
});

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req: any, res, next) => {
    req.logout((err: any) => {
        if (err) return next(err);
        res.clearCookie('token');
        res.json({ success: true, message: 'Logged out' });
    });
});

export default router;
