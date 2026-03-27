import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

export const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
};
