import { Router } from 'express';
import Spare from '../models/Spare';
import Bike from '../models/Bike';

const router = Router();

// Create a new spare
router.post('/', async (req, res) => {
    try {
        const spareData = { ...req.body };
        if (spareData.bikeId === "") spareData.bikeId = null;
        const spare = new Spare(spareData);
        await spare.save();

        const io = (req as any).io;
        if (io) {
            const updatedSpares = await Spare.find().populate('bikeId');
            io.emit('spares_updated', updatedSpares);
        }

        res.status(201).json({ success: true, data: spare });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Get all spares or filter by bikeId
router.get('/', async (req, res) => {
    try {
        const { bikeId } = req.query;
        let query = {};
        if (bikeId === 'common') {
            query = { bikeId: null };
        } else if (bikeId) {
            query = { bikeId };
        }
        const spares = await Spare.find(query).populate('bikeId').sort({ createdAt: -1 });
        res.json({ success: true, data: spares });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update a spare
router.put('/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.bikeId === "") updateData.bikeId = null;
        const spare = await Spare.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!spare) return res.status(404).json({ success: false, message: 'Spare not found' });

        const io = (req as any).io;
        if (io) {
            const updatedSpares = await Spare.find().populate('bikeId');
            io.emit('spares_updated', updatedSpares);
        }

        res.json({ success: true, data: spare });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete a spare
router.delete('/:id', async (req, res) => {
    try {
        const spare = await Spare.findByIdAndDelete(req.params.id);
        if (!spare) return res.status(404).json({ success: false, message: 'Spare not found' });

        const io = (req as any).io;
        if (io) {
            const updatedSpares = await Spare.find().populate('bikeId');
            io.emit('spares_updated', updatedSpares);
        }

        res.json({ success: true, message: 'Spare deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
