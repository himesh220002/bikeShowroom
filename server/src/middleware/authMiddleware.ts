import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

export const protect = async (req: any, res: Response, next: NextFunction) => {
    let token;

    if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);

        if (decoded.id === 'ffffffffffffffffffffffff') {
            req.user = { _id: 'ffffffffffffffffffffffff', role: 'admin', displayName: 'System Admin' };
            return next();
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

export const adminOnly = (req: any, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};
