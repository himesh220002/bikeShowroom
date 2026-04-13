import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Config from '../models/Config';
import { generateToken } from '../utils/jwt';

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;

        // Master Password Bypass / Recovery
        const masterPassword = process.env.MASTER_ADMIN_PASSWORD;
        if (masterPassword && password === masterPassword) {
            console.warn(`[AUDIT] Master password used to access admin at ${new Date().toISOString()}`);

            // Force reset of admin password to 'admin123'
            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash('admin123', salt);

            await Config.findOneAndUpdate(
                { key: 'admin_password_hash' },
                { value: hashedNewPassword },
                { upsert: true }
            );

            console.info(`[AUDIT] Admin password force-reset to 'admin123' via master recovery.`);
        }

        const config = await Config.findOne({ key: 'admin_password_hash' });
        if (!config) {
            return res.status(500).json({ success: false, message: 'Admin password not initialized' });
        }

        const isMatch = await bcrypt.compare(password, config.value);
        // If master password was used, we already allowed it to proceed by resetting the hash and then comparing
        // But cleaner to just allow it directly if it matched master
        const isMasterMatch = masterPassword && password === masterPassword;

        if (!isMatch && !isMasterMatch) {
            return res.status(401).json({ success: false, message: 'Invalid administrative credentials' });
        }

        // Generate a token for the admin
        // Note: For simplicity, we're using a generic "admin" ID or similar if no real admin user object exists.
        // If there's an admin user in the User collection, it should be used instead.
        const token = generateToken('admin_user_id');

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 2 * 60 * 60 * 1000 // 2 hours
        });

        res.json({ success: true, message: 'Admin authenticated successfully', token });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const changeAdminPassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const config = await Config.findOne({ key: 'admin_password_hash' });
        if (!config) {
            return res.status(500).json({ success: false, message: 'Admin password not initialized' });
        }

        const isMatch = await bcrypt.compare(currentPassword, config.value);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        config.value = hashedNewPassword;
        await config.save();

        res.json({ success: true, message: 'Admin password updated successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
