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
            {
                name: "Yamaha R15 V4 / M",
                category: "bike",
                tag: "Track Ready",
                description: "The R15 V4 is an icon on the track and the street, offering unparalleled performance and aerodynamics with R-Series DNA.",
                price: "1,82,000",
                threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/r_series_all/r15v4/360/",
                threeSixtyImageCount: 40,
                colors: [
                    { name: "Metallic Grey (M)", hex: "#9ca3af", image: "/images/r15m.png", colorOption: "metallic-grey", stock: 5 },
                    { name: "Racing Blue", hex: "#005aff", image: "/images/r15m.png", colorOption: "racing-blue", stock: 3 },
                    { name: "Dark Knight", hex: "#18181b", image: "/images/r15m.png", colorOption: "dark-knight", stock: 2 },
                    { name: "Metallic Red", hex: "#ef4444", image: "/images/r15m.png", colorOption: "metallic-red", stock: 2 }
                ],
                brochureUrl: "https://www.yamaha-motor-india.com/yamaha-r15v4.html"
            },
            {
                name: "Yamaha MT-15 V2",
                category: "bike",
                tag: "Street King",
                description: "The MT-15 V2 is for those who want to stand out while tearing up the asphalt. Hyper-naked styling with serious performance.",
                price: "1,68,000",
                threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/mt_series/mt15v2/360/",
                threeSixtyImageCount: 40,
                colors: [
                    { name: "Cyan Storm", hex: "#06b6d4", image: "/images/mt15.png", colorOption: "cyan-storm", stock: 3 },
                    { name: "Ice Fluo-Vermillion", hex: "#f8fafc", image: "/images/mt15.png", colorOption: "ice-fluo", stock: 2 },
                    { name: "Racing Blue", hex: "#1e3a8a", image: "/images/mt15.png", colorOption: "racing-blue", stock: 2 }
                ],
                brochureUrl: "https://www.yamaha-motor-india.com/yamaha-mt-15-v2.html"
            },
            {
                name: "Yamaha MT-03",
                category: "bike",
                tag: "Dark Lightning",
                description: "321cc Twin Cylinder power. The MT-03 is a lightweight, versatile hyper-naked that delivers serious thrills.",
                price: "3,45,000",
                colors: [
                    { name: "Midnight Cyan", hex: "#0891b2", image: "/images/mt03-cyan.webp", colorOption: "midnight-cyan", stock: 1 }
                ],
                brochureUrl: "https://www.yamaha-motor-india.com/yamaha-mt-03.html"
            },
            {
                name: "Yamaha FZ-S FI V4",
                category: "bike",
                tag: "Street Fighter",
                description: "Muscular styling with advanced performance features like Traction Control for a superior ride.",
                price: "1,29,000",
                threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fzs-fi-v4-std/360/",
                threeSixtyImageCount: 37,
                colors: [
                    { name: "Racing Blue", hex: "#1e3a8a", image: "/images/fzs.png", colorOption: "racing-blue", stock: 5 },
                    { name: "Matte Black", hex: "#18181b", image: "/images/fzs.png", colorOption: "matte-black", stock: 3 },
                    { name: "Matte Titan", hex: "#3f3f46", image: "/images/fzs.png", colorOption: "matte-titan", stock: 4 }
                ],
                brochureUrl: "https://www.yamaha-motor-india.com/yamaha-fz-fi.html"
            },
            {
                name: "Yamaha FZ FI",
                category: "bike",
                tag: "Street Commuter",
                description: "The lord of the streets, offering a perfect balance of fuel efficiency and muscular performance for the daily urban rider.",
                price: "1,16,500",
                threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fzs-fi-v4-std/360/",
                threeSixtyImageCount: 37,
                colors: [
                    { name: "Blue", hex: "#2563eb", image: "/images/fzs.png", colorOption: "blue", stock: 4 },
                    { name: "Matte Black", hex: "#18181b", image: "/images/fzs.png", colorOption: "matte-black", stock: 3 }
                ],
                brochureUrl: "https://www.yamaha-motor-india.com/yamaha-fz-fi.html"
            },
            {
                name: "Yamaha FZ-S FI V4 (Cyber Rave)",
                category: "bike",
                tag: "Digital Sensation",
                description: "The Cyber Rave edition of FZ-S FI V4 is built for the trendsetters. A perfect blend of technology and street presence.",
                price: "1,29,500",
                threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fz-rave/360/",
                threeSixtyImageCount: 37,
                colors: [
                    { name: "Cyber Rave", hex: "#000", image: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fz-rave/360/1.webp", colorOption: "cyber-rave", stock: 2 }
                ],
                brochureUrl: "https://www.yamaha-motor-india.com/yamaha-fz-fi.html"
            },
            {
                name: "Yamaha FZ-X",
                category: "bike",
                tag: "Neo-Retro",
                description: "Ride into the future with a classic soul. Retro aesthetics meets modern performance.",
                price: "1,36,000",
                threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fzx/360/",
                threeSixtyImageCount: 40,
                colors: [
                    { name: "Matte Copper", hex: "#b45309", image: "/images/fzx.png", colorOption: "matte-copper", stock: 2 },
                    { name: "Chrome", hex: "#94a3b8", image: "/images/fzx.png", colorOption: "chrome", stock: 1 }
                ],
                brochureUrl: "https://www.yamaha-motor-india.com/yamaha-fzx.html"
            },
            {
                name: "Yamaha XSR 155",
                category: "bike",
                tag: "Classic Elite",
                description: "Retro elegance with Yamaha's high-performance 155cc VVA engine. A masterpiece of design.",
                price: "1,48,000",
                threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/x_series_all/xsr/360/",
                threeSixtyImageCount: 36,
                colorBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/xsr_series/xsr155/color/",
                colors: [
                    { name: "Heritage Silver", hex: "#d1d5db", image: "/images/XSR155.png", colorOption: "silver", stock: 2 }
                ],
                brochureUrl: "https://www.yamaha-motor-india.com/yamaha-xsr-155.html"
            },
            {
                name: "Yamaha Aerox 155",
                category: "scooty",
                tag: "Sport Scooter",
                description: "India's first maxi-scooter with R-Series engine DNA and traction control.",
                price: "1,48,000",
                threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/aerox_all/aerox155vs/360/",
                threeSixtyImageCount: 40,
                colors: [
                    { name: "Racing Blue", hex: "#2563eb", image: "/images/rayzr.png", colorOption: "racing-blue", stock: 3 },
                    { name: "Grey Vermillion", hex: "#4b5563", image: "/images/rayzr.png", colorOption: "grey", stock: 2 }
                ],
                brochureUrl: "https://www.yamaha-motor-india.com/yamaha-aerox-155.html"
            },
            {
                name: "Yamaha RayZR 125 FI",
                category: "scooty",
                tag: "Street Rally",
                description: "Rugged styling and hybrid technology. The ultimate street machine for the bold.",
                price: "84,000",
                threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/rayzr_all/ray-zr-streetrally125fihybrid/360_new/",
                threeSixtyImageCount: 36,
                colors: [
                    { name: "Cyan Blue", hex: "#0891b2", image: "/images/rayzr.png", colorOption: "cyan-blue", stock: 4 },
                    { name: "Matte Red", hex: "#b91c1c", image: "/images/rayzr.png", colorOption: "matte-red", stock: 3 }
                ],
                brochureUrl: "https://www.yamaha-motor-india.com/yamaha-rayzr-125-fi-hybrid.html"
            },
            {
                name: "Yamaha Fascino 125 FI",
                category: "scooty",
                tag: "Fashionable",
                description: "Elegance meets performance. Retro-classic styling with modern hybrid technology.",
                price: "79,000",
                threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fascino_all/fascino125fi-new/360_new/",
                threeSixtyImageCount: 40,
                colorBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fascino_series/fascino125/color/",
                colors: [
                    { name: "Vivid Red", hex: "#dc2626", image: "/images/fascino.png", colorOption: "vivid-red", stock: 3 },
                    { name: "Metallic Black", hex: "#000", image: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fascino_all/fascino125fi-new/color/Drum/Metallic-Black-cd.webp", colorOption: "metallic-black", stock: 2 }
                ],
                brochureUrl: "https://www.yamaha-motor-india.com/yamaha-fascino-125-fi-hybrid.html"
            }
        ];

        // Drop indices
        try {
            await Bike.collection.dropIndexes();
        } catch (e) {
            // Ignore
        }

        // Clear and seed
        await Bike.deleteMany({});
        const seeded = await Bike.insertMany(initialBikes);

        // Emit socket event
        if ((req as any).io) {
            (req as any).io.emit('inventory_synced', seeded);
        }

        res.json({ success: true, count: seeded.length });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
