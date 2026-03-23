// import { Gauge, Cpu, Binary, Shield, Zap, Fuel, Wind, Bike as BikeIcon, LucideIcon } from "lucide-react";

export interface Bike {
    slug: string;
    name: string;
    variant: string;
    price: string;
    image: string;
    specs: { icon: string; label: string }[];
    tag: string;
    color: string;
    description: string;
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
    threeSixtyBaseUrl?: string;
    brochureUrl?: string;
}

export const BIKES: Bike[] = [
    {
        slug: "r15m",
        name: "Yamaha R15M",
        variant: "Metallic Grey",
        price: "1,96,000",
        image: "/images/r15m.png",
        specs: [
            { icon: "Gauge", label: "155cc LC4V Engine" },
            { icon: "Cpu", label: "Traction Control" },
            { icon: "Binary", label: "Quick Shifter" }
        ],
        tag: "Track Ready",
        color: "bg-zinc-400",
        description: "Experience the DNA of the R-Series with the all-new R15M. Packed with track-bred technology like Traction Control and Quick Shifter, it's designed to dominate every corner.",
        fullSpecs: {
            engine: "155cc, Liquid Cooled, 4-Stroke, SOHC, 4-Valve",
            power: "18.4 PS @ 10,000 RPM",
            torque: "14.2 Nm @ 7,500 RPM",
            transmission: "6-Speed with Assist & Slipper Clutch",
            brakes: "Dual Channel ABS (282mm Front / 220mm Rear)",
            fuelCapacity: "11 Liters",
            weight: "141 kg",
            seatHeight: "815 mm",
            tyres: "100/80-17 (Front), 140/70-17 (Rear) Radial",
            features: ["Traction Control System", "Quick Shifter (Up)", "VVA (Variable Valve Actuation)", "LCD Instrument Cluster"]
        },
        threeSixtyBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/r_series_all/r15v4/360/",
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-r15v4.html"
    },
    {
        slug: "r15-v4-racing-blue",
        name: "Yamaha R15 V4",
        variant: "Racing Blue",
        price: "1,87,300",
        image: "/images/r15m.png",
        specs: [
            { icon: "Gauge", label: "155cc Engine" },
            { icon: "Zap", label: "VVA Tech" },
            { icon: "Shield", label: "Dual ABS" }
        ],
        tag: "Track Ready",
        color: "bg-racing-blue",
        description: "The R15 V4 in Racing Blue is an icon on the track and the street, offering unparalleled performance and aerodynamics.",
        fullSpecs: {
            engine: "155cc Liquid Cooled",
            power: "18.4 PS @ 10,000 RPM",
            torque: "14.2 Nm @ 7,500 RPM",
            transmission: "6-speed",
            brakes: "Dual Channel ABS",
            fuelCapacity: "11 Liters",
            weight: "141 kg",
            seatHeight: "815 mm",
            tyres: "100/80-17 (F), 140/70-17 (R)",
            features: ["R-Series DNA", "Bi-Functional LED Headlight", "Side Stand Engine Cut-off"]
        },
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-r15v4.html"
    },
    {
        slug: "mt15-cyan-storm",
        name: "Yamaha MT-15 V2",
        variant: "Cyan Storm",
        price: "1,68,000",
        image: "/images/mt15.png",
        specs: [
            { icon: "Gauge", label: "VVA Engine" },
            { icon: "Cpu", label: "USD Forks" },
            { icon: "Binary", label: "Hyper-Naked" }
        ],
        tag: "Street King",
        color: "bg-cyan-500",
        description: "The Dark Knight gets a vibrant update. The MT-15 V2 in Cyan Storm is for those who want to stand out while tearing up the asphalt.",
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
            features: ["USD Front Forks", "Aluminum Swingarm", "VVA Technology"]
        },
        threeSixtyBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/mt_series/mt15v2/360/",
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-mt-15-v2.html"
    },
    {
        slug: "mt03",
        name: "Yamaha MT-03",
        variant: "Midnight Cyan",
        price: "3,45,000",
        image: "/images/mt15.png",
        specs: [
            { icon: "Gauge", label: "321cc Twin-Cyl" },
            { icon: "Zap", label: "42 PS Power" },
            { icon: "Shield", label: "Dual Channel ABS" }
        ],
        tag: "Hyper Naked",
        color: "bg-cyan-900",
        description: "Pure dark lightning. The MT-03 features a sophisticated twin-cylinder engine and radical look.",
        fullSpecs: {
            engine: "321cc, Liquid-cooled, DOHC",
            power: "42 PS @ 10,750 rpm",
            torque: "29.5 Nm @ 9,000 rpm",
            transmission: "6-speed",
            brakes: "Dual Channel ABS",
            fuelCapacity: "14 Liters",
            weight: "167 kg",
            seatHeight: "780 mm",
            tyres: "110/70-17 (Front), 140/70-17 (Rear)",
            features: ["Twin Cylinder Engine", "Upside Down Forks", "LED Lighting", "Aggressive Styling"]
        },
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-mt-03.html"
    },
    {
        slug: "fz-rave",
        name: "Yamaha FZ Rave",
        variant: "Standard",
        price: "1,18,000",
        image: "/images/fzs.png",
        specs: [
            { icon: "Gauge", label: "149cc Fi Engine" },
            { icon: "Shield", label: "Single ABS" },
            { icon: "Cpu", label: "LCD Console" }
        ],
        tag: "New Arrival",
        color: "bg-zinc-700",
        description: "The new FZ Rave brings sporty performance to the daily commute with its refined 149cc engine and aggressive styling.",
        fullSpecs: {
            engine: "149cc, Air-cooled, 4-stroke",
            power: "12.4 PS @ 7,250 rpm",
            torque: "13.3 Nm @ 5,500 rpm",
            transmission: "5-speed Constant Mesh",
            brakes: "Front Disc, Rear Drum w/ ABS",
            fuelCapacity: "13 Liters",
            weight: "136 kg",
            seatHeight: "790 mm",
            tyres: "100/80-17 (Front), 140/60-R17 (Rear)",
            features: ["LED Headlight", "LCD Instrument Cluster", "E20 Compatible", "Single Channel ABS"]
        },
        threeSixtyBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fz-rave/360/",
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-fz-fi.html"
    },
    {
        slug: "fzs-v4",
        name: "Yamaha FZ-S FI V4",
        variant: "Standard",
        price: "1,29,000",
        image: "/images/fzs.png",
        specs: [
            { icon: "Gauge", label: "149cc BlueCore" },
            { icon: "Zap", label: "Traction Control" },
            { icon: "Binary", label: "Y-Connect" }
        ],
        tag: "Street Fighter",
        color: "bg-blue-900",
        description: "The Lord of the Streets gets a major tech upgrade with Traction Control and Bluetooth connectivity.",
        fullSpecs: {
            engine: "149cc Air Cooled",
            power: "12.4 PS",
            torque: "13.3 Nm",
            transmission: "5-speed",
            brakes: "Single Channel ABS",
            fuelCapacity: "13 Liters",
            weight: "136 kg",
            seatHeight: "790 mm",
            tyres: "100/80-17 (F), 140/60-17 (R)",
            features: ["Traction Control System", "LED DRLs", "Bluetooth Y-Connect"]
        },
        threeSixtyBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fzs-fi-hybrid/360-hybrid/",
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-fzs-fi-v4.html"
    },
    {
        slug: "fzx",
        name: "Yamaha FZ-X",
        variant: "Chrome Edition",
        price: "1,36,000",
        image: "/images/fzx.png",
        specs: [
            { icon: "Zap", label: "Traction Control" },
            { icon: "Fuel", label: "E20 Compatible" },
            { icon: "Binary", label: "Y-Connect" }
        ],
        tag: "Neo-Retro",
        color: "bg-orange-900",
        description: "Ride Free. The FZ-X combines retro aesthetics with modern features like Traction Control and Y-Connect.",
        fullSpecs: {
            engine: "149cc, Air Cooled",
            power: "12.4 PS",
            torque: "13.3 Nm",
            transmission: "5-speed",
            brakes: "Single Channel ABS",
            fuelCapacity: "10 Liters",
            weight: "139 kg",
            seatHeight: "810 mm",
            tyres: "100/80-17 (F), 140/60-17 (R)",
            features: ["Neo-Retro Styling", "LED Headlight", "Traction Control"]
        },
        threeSixtyBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fz_series_all/fzx-hybrid/360/",
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-fzx.html"
    },
    {
        slug: "xsr155",
        name: "Yamaha XSR155",
        variant: "Heritage Silver",
        price: "1,48,000",
        image: "/images/XSR155.png",
        specs: [
            { icon: "Gauge", label: "155cc VVA" },
            { icon: "Zap", label: "Slipper Clutch" },
            { icon: "Cpu", label: "Retro Digital" }
        ],
        tag: "Classic",
        color: "bg-zinc-600",
        description: "Classic looks, modern performance. The XSR155 brings timeless neo-retro styling paired with the high-performance 155cc VVA engine.",
        fullSpecs: {
            engine: "155cc Liquid Cooled VVA",
            power: "19.3 PS",
            torque: "14.7 Nm",
            transmission: "6-speed Slipper Clutch",
            brakes: "Single Channel ABS",
            fuelCapacity: "10 Liters",
            weight: "134 kg",
            seatHeight: "810 mm",
            tyres: "110/70-17 (F), 140/70-17 (R)",
            features: ["Neo-Retro Design", "Assist & Slipper Clutch"]
        },
        threeSixtyBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/x_series_all/xsr/360/",
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-xsr155.html"
    },
    {
        slug: "aerox155",
        name: "Yamaha Aerox 155",
        variant: "Racing Blue",
        price: "1,48,000",
        image: "/images/rayzr.png",
        specs: [
            { icon: "Gauge", label: "155cc VVA" },
            { icon: "Zap", label: "Liquid Cooled" },
            { icon: "Binary", label: "Traction Control" }
        ],
        tag: "Maxi-Scooter",
        color: "bg-blue-600",
        description: "Aerox 155 is India's first maxi-scooter with a 155cc VVA engine, blending R-series DNA with scooter convenience.",
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
        threeSixtyBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/aerox_all/aerox155vs/360/",
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-aerox-155.html"
    },
    {
        slug: "rayzr-125-fi",
        name: "Yamaha RayZR 125 Fi",
        variant: "Hybrid Cyan",
        price: "84,000",
        image: "/images/rayzr.png",
        specs: [
            { icon: "Wind", label: "Hybrid Assist" },
            { icon: "Gauge", label: "125cc Fi" },
            { icon: "Shield", label: "UBS" }
        ],
        tag: "Street Rally",
        color: "bg-cyan-900",
        description: "The RayZR 125 Fi Hybrid brings a sharp design and advanced hybrid power assist for a superior riding experience.",
        fullSpecs: {
            engine: "125cc Air Cooled Hybrid",
            power: "8.2 PS",
            torque: "10.3 Nm",
            transmission: "Automatic",
            brakes: "Unified Braking System",
            fuelCapacity: "5.2 Liters",
            weight: "99 kg",
            seatHeight: "785 mm",
            tyres: "90/90-12 (F), 110/90-10 (R)",
            features: ["Hybrid Tech", "Lightweight Chassis", "SMG System"]
        },
        threeSixtyBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/rayzr_all/ray-zr-streetrally125fihybrid/360_new/",
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-rayzr-125-fi-hybrid.html"
    },
    {
        slug: "fascino-125",
        name: "Yamaha Fascino 125 Fi",
        variant: "Vivid Red",
        price: "79,000",
        image: "/images/fascino.png",
        specs: [
            { icon: "Zap", label: "Hybrid Power" },
            { icon: "Bike", label: "Classic Style" },
            { icon: "Gauge", label: "125cc Engine" }
        ],
        tag: "Fashionable",
        color: "bg-red-900",
        description: "A Style Icon. The Fascino 125 Fi Hybrid brings classic European styling to Indian roads.",
        fullSpecs: {
            engine: "125cc Hybrid",
            power: "8.2 PS",
            torque: "10.3 Nm",
            transmission: "Automatic",
            brakes: "UBS",
            fuelCapacity: "5.2 Liters",
            weight: "99 kg",
            seatHeight: "785 mm",
            tyres: "90/90-12 (Front), 110/90-10 (Rear)",
            features: ["Classic Design", "Hybrid Assist", "Auto Stop/Start"]
        },
        threeSixtyBaseUrl: "https://www.yamaha-motor-india.com/theme/v4/images/webp_images/fascino_all/fascino125fi-new/360_new/",
        brochureUrl: "https://www.yamaha-motor-india.com/yamaha-fascino-125-fi-hybrid.html"
    }
];