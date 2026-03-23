import { Router } from 'express';
import Bike from '../models/Bike';

const router = Router();

// Get all bikes with stock
router.get('/', async (req, res) => {
    try {
        const bikes = await Bike.find().sort({ name: 1 });
        res.json({ success: true, data: bikes });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create new bike/scooty
router.post('/', async (req, res) => {
    try {
        const bike = new Bike(req.body);
        await bike.save();
        res.status(201).json({ success: true, data: bike });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update stock
router.put('/:id', async (req, res) => {
    try {
        const bike = await Bike.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bike) return res.status(404).json({ success: false, message: 'Bike not found' });

        // Emit socket event
        if ((req as any).io) {
            (req as any).io.emit('inventory_updated', bike);
        }

        res.json({ success: true, data: bike });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Seed initial data
router.post('/seed', async (req, res) => {
    try {
        const initialBikes = [
            // R15 Series
            { name: "Yamaha R15M", variant: "Metallic Grey", price: "1,96,000", image: "/images/r15m.png", tag: "Track Ready", color: "Metallic Grey", stock: 5, category: "bike" },
            { name: "Yamaha R15 V4", variant: "Racing Blue", price: "1,87,300", image: "/images/r15m.png", tag: "Track Ready", color: "Racing Blue", stock: 3, category: "bike" },
            { name: "Yamaha R15 V4", variant: "Metallic Red", price: "1,82,000", image: "/images/r15m.png", tag: "Track Ready", color: "Metallic Red", stock: 2, category: "bike" },
            { name: "Yamaha R15 V4", variant: "Dark Knight", price: "1,83,000", image: "/images/r15m.png", tag: "Track Ready", color: "Dark Knight", stock: 2, category: "bike" },

            // MT Series
            { name: "Yamaha MT-15", variant: "Cyan Storm", price: "1,68,000", image: "/images/mt15.png", tag: "Street King", color: "Cyan Storm", stock: 3, category: "bike" },
            { name: "Yamaha MT-15", variant: "Ice Fluo-Vermillion", price: "1,68,000", image: "/images/mt15.png", tag: "Street King", color: "Ice Fluo", stock: 2, category: "bike" },
            { name: "Yamaha MT-03", variant: "Midnight Cyan", price: "3,45,000", image: "/images/mt15.png", tag: "Hyper Naked", color: "Midnight Cyan", stock: 1, category: "bike" },

            // FZ Series
            { name: "Yamaha FZ Rave", variant: "Standard", price: "1,18,000", image: "/images/fzs.png", tag: "New Arrival", color: "Matte Titan", stock: 4, category: "bike" },
            { name: "Yamaha FZ-S FI V4", variant: "Standard", price: "1,29,000", image: "/images/fzs.png", tag: "Street Fighter", color: "Racing Blue", stock: 5, category: "bike" },
            { name: "Yamaha FZ-S Hybrid", variant: "Standard", price: "1,23,000", image: "/images/fzs.png", tag: "Efficient", color: "Matte Black", stock: 3, category: "bike" },
            { name: "Yamaha FZ", variant: "Standard", price: "1,16,500", image: "/images/fzs.png", tag: "Commuter", color: "Blue", stock: 4, category: "bike" },
            { name: "Yamaha FZ-X", variant: "Chrome", price: "1,36,000", image: "/images/fzx.png", tag: "Neo-Retro", color: "Matte Copper", stock: 2, category: "bike" },

            // XSR
            { name: "Yamaha XSR155", variant: "TVC Edition", price: "1,48,000", image: "/images/XSR155.png", tag: "Classic", color: "Heritage Silver", stock: 2, category: "bike" },

            // Scooters
            { name: "Yamaha Aerox 155", variant: "Standard", price: "1,48,000", image: "/images/rayzr.png", tag: "Maxi-Scooter", color: "Racing Blue", stock: 3, category: "scooty" },
            { name: "Yamaha RayZR 125 Fi", variant: "Hybrid", price: "84,000", image: "/images/rayzr.png", tag: "Street Rally", color: "Cyan Blue", stock: 4, category: "scooty" },
            { name: "Yamaha Fascino 125 Fi", variant: "Hybrid", price: "79,000", image: "/images/fascino.png", tag: "Fashionable", color: "Vivid Red", stock: 3, category: "scooty" }
        ];

        // Drop the old unique name index if it exists
        try {
            await Bike.collection.dropIndex("name_1");
        } catch (e) {
            // Index might not exist, ignore
        }

        // Clear existing and seed
        await Bike.deleteMany({});
        const seeded = await Bike.insertMany(initialBikes);

        // Emit socket event for full reload
        if ((req as any).io) {
            (req as any).io.emit('inventory_synced', seeded);
        }

        res.json({ success: true, count: seeded.length });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
