import express from 'express';
import Config from '../models/Config';

const router = express.Router();

// Get all config or specific keys
router.get('/', async (req, res) => {
    try {
        const configs = await Config.find();
        const configMap = configs.reduce((acc: any, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.json({ success: true, data: configMap });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update or create config keys
router.post('/', async (req, res) => {
    try {
        const { settings } = req.body; // Expecting { key: value, ... }

        const operations = Object.entries(settings).map(([key, value]) => ({
            updateOne: {
                filter: { key },
                update: { key, value },
                upsert: true
            }
        }));

        await Config.bulkWrite(operations);
        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
