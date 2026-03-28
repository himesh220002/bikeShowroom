export interface BikeColor {
    name: string;
    hex: string;
    image: string;
    colorOption: string;
    stock: number;
}

export interface Bike {
    slug: string;
    name: string;
    category: 'bike' | 'scooty';
    tag: string;
    description: string;
    price: string;
    colors: BikeColor[];
    specs: { icon: string; label: string }[];
    fullSpecs: {
        engine: string;
        power: string;
        torque: string;
        transmission: string;
        brakes: string;
        fuelCapacity: string;
        weight: string;
        seatHeight: string;
        tyres: string;
        features: string[];
    };
    threeSixtyUrl?: string;
    threeSixtyImageCount?: number;
    colorBaseUrl?: string;
    brochureUrl?: string;
}

export const BIKES: Bike[] = [
    {
        slug: "r15v4",
        name: "Yamaha R15 V4 / M",
        category: "bike",
        price: "1,82,000 - 1,98,000",
        colors: [
            { name: "Metallic Grey (M)", hex: "#9ca3af", image: "/images/r15m.png", colorOption: "metallic-grey", stock: 5 },
            { name: "Racing Blue", hex: "#005aff", image: "/images/r15m.png", colorOption: "racing-blue", stock: 3 },
            { name: "Dark Knight", hex: "#18181b", image: "/images/r15m.png", colorOption: "dark-knight", stock: 2 },
            { name: "Metallic Red", hex: "#ef4444", image: "/images/r15m.png", colorOption: "metallic-red", stock: 2 }
        ],
        specs: [
            { icon: "Gauge", label: "155cc VVA Engine" },
            { icon: "Binary", label: "Quick Shifter" },
            { icon: "Cpu", label: "Traction Control" }
        ],
        tag: "Track Ready",
        description: "The R15 V4 is an icon on the track and the street, offering unparalleled performance and aerodynamics with R-Series DNA.",
        fullSpecs: {
            engine: "155cc Liquid Cooled, 4-Valve, VVA",
            power: "18.4 PS @ 10,000 RPM",
            torque: "14.2 Nm @ 7,500 RPM",
            transmission: "6-speed with Slipper Clutch",
            brakes: "Dual Channel ABS",
            fuelCapacity: "11 Liters",
            weight: "141 kg",
            seatHeight: "815 mm",
            tyres: "100/80-17 (F), 140/70-17 (R)",
            features: ["R-Series DNA", "Bi-Functional LED Headlight", "Traction Control", "Quick Shifter"]
        },
        threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/r_series_all/r15v4/360/",
        threeSixtyImageCount: 40,
        brochureUrl: "/brochure/r15.pdf"
    },
    {
        slug: "mt15",
        name: "Yamaha MT-15 V2",
        category: "bike",
        price: "1,68,000 - 1,74,000",
        colors: [
            { name: "Cyan Storm", hex: "#06b6d4", image: "/images/mt15.png", colorOption: "cyan-storm", stock: 3 },
            { name: "Ice Fluo-Vermillion", hex: "#f8fafc", image: "/images/mt15.png", colorOption: "ice-fluo", stock: 2 },
            { name: "Racing Blue", hex: "#1e3a8a", image: "/images/mt15.png", colorOption: "racing-blue", stock: 2 }
        ],
        specs: [
            { icon: "Gauge", label: "155cc LC4V VVA" },
            { icon: "Cpu", label: "USD Forks" },
            { icon: "Binary", label: "Aluminum Swingarm" }
        ],
        tag: "Street King",
        description: "The Dark Knight gets a vibrant update. The MT-15 V2 is for those who want to stand out while tearing up the asphalt.",
        fullSpecs: {
            engine: "155cc Liquid Cooled",
            power: "18.4 PS",
            torque: "14.1 Nm",
            transmission: "6-speed",
            brakes: "Dual Channel ABS",
            fuelCapacity: "10 Liters",
            weight: "141 kg",
            seatHeight: "810 mm",
            tyres: "100/80-17 (F), 140/70-17 (R)",
            features: ["USD Front Forks", "Aluminum Swingarm", "VVA Technology", "LED Tail Light"]
        },
        threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/mt_series/mt15v2/360/",
        threeSixtyImageCount: 40,
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-mt-15-v2.html"
    },
    {
        slug: "mt03",
        name: "Yamaha MT-03",
        category: "bike",
        price: "4,60,000",
        colors: [
            { name: "Midnight Cyan", hex: "#0891b2", image: "/images/mt03-cyan.png", colorOption: "midnight-cyan", stock: 1 }
        ],
        specs: [
            { icon: "Gauge", label: "321cc Twin Cylinder" },
            { icon: "Zap", label: "Hyper Naked" },
            { icon: "Shield", label: "Dual Channel ABS" }
        ],
        tag: "Dark Lightning",
        description: "Master of Torque. The MT-03 is a lightweight, versatile hyper-naked that delivers serious thrills with its twin-cylinder engine.",
        fullSpecs: {
            engine: "321cc, Liquid-cooled, 4-stroke, DOHC, 4-valves",
            power: "42 PS @ 10,750 RPM",
            torque: "29.5 Nm @ 9,000 RPM",
            transmission: "6-speed",
            brakes: "Dual Channel ABS",
            fuelCapacity: "14 Liters",
            weight: "167 kg",
            seatHeight: "780 mm",
            tyres: "110/70-17 (F), 140/70-17 (R)",
            features: ["Twin Cylinder Engine", "Inverted front forks", "Multi-function LCD instrument cluster"]
        },
        brochureUrl: "/brochure/mt03.pdf"
    },
    {
        slug: "fzs-v4",
        name: "Yamaha FZ-S FI V4",
        category: "bike",
        price: "1,29,000 - 1,30,000",
        colors: [
            { name: "Racing Blue", hex: "#1e3a8a", image: "/images/fzs.png", colorOption: "racing-blue", stock: 5 },
            { name: "Matte Black", hex: "#18181b", image: "/images/fzs.png", colorOption: "matte-black", stock: 3 },
            { name: "Matte Titan", hex: "#3f3f46", image: "/images/fzs.png", colorOption: "matte-titan", stock: 4 }
        ],
        specs: [
            { icon: "Gauge", label: "149cc Fi Engine" },
            { icon: "Cpu", label: "Traction Control" },
            { icon: "Shield", label: "Single ABS" }
        ],
        tag: "Street Fighter",
        description: "The FZ-S FI V4 combines muscular styling with advanced performance features like Traction Control for a superior ride.",
        fullSpecs: {
            engine: "149cc, Air-cooled, 4-stroke, SOHC, 2-valve",
            power: "12.4 PS @ 7,250 RPM",
            torque: "13.3 Nm @ 5,500 RPM",
            transmission: "5-speed",
            brakes: "Single Channel ABS",
            fuelCapacity: "13 Liters",
            weight: "136 kg",
            seatHeight: "790 mm",
            tyres: "100/80-17 (F), 140/60-R17 (R)",
            features: ["Traction Control System", "LED Headlight & Tail Light", "E20 Compatible"]
        },
        threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fzs-fi-v4-std/360/",
        threeSixtyImageCount: 37,
        brochureUrl: "/brochure/fzs-fi-series.pdf"
    },
    {
        slug: "fz-fi",
        name: "Yamaha FZ FI",
        category: "bike",
        price: "1,16,000",
        colors: [
            { name: "Blue", hex: "#2563eb", image: "/images/fzs.png", colorOption: "blue", stock: 4 },
            { name: "Matte Black", hex: "#18181b", image: "/images/fzs.png", colorOption: "matte-black", stock: 3 }
        ],
        specs: [
            { icon: "Gauge", label: "149cc Fi Engine" },
            { icon: "Shield", label: "Single ABS" },
            { icon: "Fuel", label: "E20 Compatible" }
        ],
        tag: "Street Commuter",
        description: "The FZ FI is the lord of the streets, offering a perfect balance of fuel efficiency and muscular performance for the daily urban rider.",
        fullSpecs: {
            engine: "149cc, Air-cooled, 4-stroke",
            power: "12.4 PS",
            torque: "13.3 Nm",
            transmission: "5-speed",
            brakes: "Single Channel ABS",
            fuelCapacity: "13 Liters",
            weight: "135 kg",
            seatHeight: "790 mm",
            tyres: "100/80-17 (F), 140/60-R17 (R)",
            features: ["Multi-function LCD Cluster", "LED Headlight", "Side Stand Cut-off"]
        },
        threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fzs-fi-v4-std/360/",
        threeSixtyImageCount: 37,
        brochureUrl: "/brochure/fzs-fi-series.pdf"
    },
    {
        slug: "fzs-rave",
        name: "Yamaha FZ-S FI V4 (Cyber Rave)",
        category: "bike",
        price: "1,29,500 - 1,30,500",
        colors: [
            { name: "Cyber Rave", hex: "#000", image: "/images/fz-rave.png", colorOption: "cyber-rave", stock: 2 }
        ],
        specs: [
            { icon: "Gauge", label: "149cc Fi Engine" },
            { icon: "Zap", label: "Cyber Rave Edition" },
            { icon: "Cpu", label: "Traction Control" }
        ],
        tag: "Digital Sensation",
        description: "The Cyber Rave edition of FZ-S FI V4 is built for the trendsetters. A perfect blend of technology and street presence.",
        fullSpecs: {
            engine: "149cc, Air-cooled, 4-stroke",
            power: "12.4 PS",
            torque: "13.3 Nm",
            transmission: "5-speed",
            brakes: "Single Channel ABS",
            fuelCapacity: "13 Liters",
            weight: "136 kg",
            seatHeight: "790 mm",
            tyres: "100/80-17 (F), 140/60-R17 (R)",
            features: ["Traction Control System", "Cyber Rave Special Color", "LED Headlight"]
        },
        threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fz-rave/360/",
        threeSixtyImageCount: 37,
        brochureUrl: "/brochure/fz_rave.pdf"
    },
    {
        slug: "fzx",
        name: "Yamaha FZ-X",
        category: "bike",
        price: "1,36,000 - 1,40,000",
        colors: [
            { name: "Matte Copper", hex: "#b45309", image: "/images/fzx.png", colorOption: "matte-copper", stock: 2 },
            { name: "Chrome", hex: "#94a3b8", image: "/images/fzx.png", colorOption: "chrome", stock: 1 }
        ],
        specs: [
            { icon: "Gauge", label: "149cc Fi Engine" },
            { icon: "Zap", label: "Neo-Retro Style" },
            { icon: "Shield", label: "Traction Control" }
        ],
        tag: "Neo-Retro",
        description: "Ride into the future with a classic soul. The FZ-X brings vintage aesthetics to modern performance and features.",
        fullSpecs: {
            engine: "149cc Air Cooled",
            power: "12.4 PS",
            torque: "13.3 Nm",
            transmission: "5-speed",
            brakes: "Single Channel ABS",
            fuelCapacity: "10 Liters",
            weight: "139 kg",
            seatHeight: "810 mm",
            tyres: "100/80-17 (F), 140/60-R17 (R)",
            features: ["Neo-Retro Design", "Bluetooth Connectivity", "Traction Control"]
        },
        threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fzx/360/",
        threeSixtyImageCount: 40,
        brochureUrl: "/brochure/FZ-X_Hybrid.pdf"
    },
    {
        slug: "xsr155",
        name: "Yamaha XSR 155",
        category: "bike",
        price: "1,48,000",
        colors: [
            { name: "Heritage Silver", hex: "#d1d5db", image: "/images/XSR155.png", colorOption: "silver", stock: 2 }
        ],
        specs: [
            { icon: "Gauge", label: "155cc Legend" },
            { icon: "Zap", label: "Classic Design" },
            { icon: "Binary", label: "VVA Engine" }
        ],
        tag: "Classic Elite",
        description: "The XSR 155 is a masterpiece of design, blending retro elegance with Yamaha's high-performance 155cc VVA engine.",
        fullSpecs: {
            engine: "155cc VVA",
            power: "19.3 PS",
            torque: "14.7 Nm",
            transmission: "6-speed",
            brakes: "Single Channel ABS",
            fuelCapacity: "10 Liters",
            weight: "134 kg",
            seatHeight: "810 mm",
            tyres: "110/70-17 (F), 140/70-17 (R)",
            features: ["Retro LCD Instrument", "LED Headlight & Tail Light", "Assist & Slipper Clutch"]
        },
        threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/x_series_all/xsr/360/",
        threeSixtyImageCount: 36,
        colorBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/xsr_series/xsr155/color/",
        brochureUrl: "/brochure/xsr155.pdf"
    },
    {
        slug: "aerox",
        name: "Yamaha Aerox 155",
        category: "scooty",
        price: "1,48,000",
        colors: [
            { name: "Racing Blue", hex: "#2563eb", image: "/images/rayzr.png", colorOption: "racing-blue", stock: 3 },
            { name: "Grey Vermillion", hex: "#4b5563", image: "/images/rayzr.png", colorOption: "grey", stock: 2 }
        ],
        specs: [
            { icon: "Gauge", label: "155cc VVA" },
            { icon: "Zap", label: "Maxi-Scooter" },
            { icon: "Binary", label: "Traction Control" }
        ],
        tag: "Sport Scooter",
        description: "Unleash the performance with Aerox 155. India's first maxi-scooter with R-Series engine DNA and traction control.",
        fullSpecs: {
            engine: "155cc Liquid Cooled VVA",
            power: "15 PS @ 8,000 rpm",
            torque: "13.9 Nm @ 6,500 rpm",
            transmission: "V-Belt Automatic",
            brakes: "Front Disc with ABS",
            fuelCapacity: "5.5 Liters",
            weight: "126 kg",
            seatHeight: "790 mm",
            tyres: "110/80-14 (Front), 140/70-14 (Rear)",
            features: ["Traction Control", "VVA Technology", "Smart Key System"]
        },
        threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/aerox_all/aerox155vs/360/",
        threeSixtyImageCount: 40,
        brochureUrl: "/brochure/aerox.pdf"
    },
    {
        slug: "rayzr",
        name: "Yamaha RayZR 125 FI",
        category: "scooty",
        price: "85,030 - 98,130",
        colors: [
            { name: "Cyan Blue", hex: "#0891b2", image: "/images/rayzr.png", colorOption: "cyan-blue", stock: 4 },
            { name: "Matte Red", hex: "#b91c1c", image: "/images/rayzr.png", colorOption: "matte-red", stock: 3 }
        ],
        specs: [
            { icon: "Gauge", label: "125cc Hybrid" },
            { icon: "Zap", label: "Street Rally" },
            { icon: "Shield", label: "UBS Brakes" }
        ],
        tag: "Street Rally",
        description: "The RayZR 125 Fi Hybrid is designed for the bold. With its rugged styling and hybrid technology, it's the ultimate street machine.",
        fullSpecs: {
            engine: "125cc Air Cooled FI Hybrid",
            power: "8.2 PS",
            torque: "10.3 Nm",
            transmission: "V-Belt Automatic",
            brakes: "Front Disc / Rear Drum",
            fuelCapacity: "5.2 Liters",
            weight: "99 kg",
            seatHeight: "785 mm",
            tyres: "90/90-12 (F), 110/90-10 (R)",
            features: ["Hybrid Tech (SMG)", "LED Headlight", "Lightweight Chassis"]
        },
        threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/rayzr_all/ray-zr-streetrally125fihybrid/360_new/",
        threeSixtyImageCount: 36,
        brochureUrl: "/brochure/ray-zr-streetrally125fihybrid.pdf"
    },
    {
        slug: "fascino",
        name: "Yamaha Fascino 125 FI",
        category: "scooty",
        price: "79,900 - 94,530",
        colors: [
            { name: "Vivid Red", hex: "#dc2626", image: "/images/fascino.png", colorOption: "vivid-red", stock: 3 },
            { name: "Metallic Black", hex: "#000", image: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fascino_all/fascino125fi-new/color/Drum/Metallic-Black-cd.webp", colorOption: "metallic-black", stock: 2 }
        ],
        specs: [
            { icon: "Gauge", label: "125cc Hybrid" },
            { icon: "Zap", label: "Fashionable" },
            { icon: "Shield", label: "SMG System" }
        ],
        tag: "Fashionable",
        description: "Elegance meets performance. The Fascino 125 Fi Hybrid brings a touch of class to the Indian roads with its retro-classic styling.",
        fullSpecs: {
            engine: "125cc FI Hybrid",
            power: "8.2 PS",
            torque: "10.3 Nm",
            transmission: "V-Belt Automatic",
            brakes: "Front Disc / Rear Drum",
            fuelCapacity: "5.2 Liters",
            weight: "99 kg",
            seatHeight: "780 mm",
            tyres: "90/90-12 (F), 110/90-10 (R)",
            features: ["Hybrid Tech", "Classy Design", "Spacious Underseat Storage"]
        },
        threeSixtyUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fascino_all/fascino125fi-new/360_new/",
        threeSixtyImageCount: 40,
        colorBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fascino_series/fascino125/color/",
        brochureUrl: "/brochure/fascinoS.pdf"
    }
];