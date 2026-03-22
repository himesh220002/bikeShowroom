import { Gauge, Cpu, Binary, Shield, Zap, Fuel, Wind, Bike } from "lucide-react";

export const BIKES = [
    {
        slug: "r15m",
        name: "R15M",
        variant: "Racing Blue",
        price: "1,96,000",
        image: "/images/r15m.png",
        specs: [
            { icon: Gauge, label: "155cc LC4V Engine" },
            { icon: Cpu, label: "Traction Control" },
            { icon: Binary, label: "Quick Shifter" }
        ],
        tag: "Track Ready",
        color: "bg-racing-blue",
        description: "Experience the DNA of the R-Series with the all-new R15M. Packed with track-bred technology like Traction Control and Quick Shifter, it's designed to dominate every corner.",
        fullSpecs: {
            engine: "155cc, Liquid Cooled, 4-Stroke, SOHC, 4-Valve",
            power: "18.4 PS @ 10,000 RPM",
            torque: "14.2 Nm @ 7,500 RPM",
            transmission: "6-Speed with Assist & Slipper Clutch",
            brakes: "Dual Channel ABS (282mm Front / 220mm Rear)",
            fuelCapacity: "11 Liters",
            weight: "141 kg (Curwb)",
            seatHeight: "815 mm",
            tyres: "100/80-17 (Front), 140/70-17 (Rear) Radial",
            features: ["Traction Control System", "Quick Shifter (Up)", "VVA (Variable Valve Actuation)", "LCD Instrument Cluster"]
        }
    },
    {
        slug: "mt15",
        name: "MT-15 V2",
        variant: "Dark Matte Blue",
        price: "1,68,000",
        image: "/images/mt15.png",
        specs: [
            { icon: Gauge, label: "VVA Powered Engine" },
            { icon: Cpu, label: "Upside Down Forks" },
            { icon: Binary, label: "Hyper-Naked" }
        ],
        tag: "Street King",
        color: "bg-zinc-800",
        description: "The Dark Warrior returns. The MT-15 V2 brings the same aggressive styling and performance of the MT series to the street, now with advanced USD forks for superior handling.",
        fullSpecs: {
            engine: "155cc, Liquid Cooled, 4-Stroke, SOHC, 4-Valve",
            power: "18.4 PS @ 10,000 RPM",
            torque: "14.1 Nm @ 7,500 RPM",
            transmission: "6-Speed with Assist & Slipper Clutch",
            brakes: "Dual Channel ABS (282mm Front / 220mm Rear)",
            fuelCapacity: "10 Liters",
            weight: "141 kg",
            seatHeight: "810 mm",
            tyres: "100/80-17 (Front), 140/70-17 (Rear)",
            features: ["USD Front Forks", "Aluminum Swingarm", "VVA Technology", "LED Headlight & Taillight"]
        }
    },
    {
        slug: "fzs",
        name: "FZ-S FI",
        variant: "Matte Black",
        price: "1,22,000",
        image: "/images/fzs.png",
        specs: [
            { icon: Gauge, label: "Blue Core Engine" },
            { icon: Shield, label: "Single Channel ABS" },
            { icon: Cpu, label: "Negative LCD" }
        ],
        tag: "Street Fighter",
        color: "bg-zinc-700",
        description: "The Lord of the Streets. FZ-S FI continues to set benchmarks in the street fighter category with its muscular design and refined Blue Core engine.",
        fullSpecs: {
            engine: "149cc, Air Cooled, 4-Stroke, SOHC, 2-Valve",
            power: "12.4 PS @ 7,250 RPM",
            torque: "13.3 Nm @ 5,500 RPM",
            transmission: "5-Speed",
            brakes: "Single Channel ABS (Disc Front & Rear)",
            fuelCapacity: "13 Liters",
            weight: "135 kg",
            seatHeight: "790 mm",
            tyres: "100/80-17 (Front), 140/60-17 (Rear)",
            features: ["Blue Core Technology", "Side Stand Engine Cut-off", "Negative LCD Instrument Cluster"]
        }
    },
    {
        slug: "fzx",
        name: "FZ-X",
        variant: "Matte Copper",
        price: "1,36,000",
        image: "/images/fzx.png",
        specs: [
            { icon: Zap, label: "Traction Control" },
            { icon: Fuel, label: "E20 Compatible" },
            { icon: Binary, label: "Y-Connect" }
        ],
        tag: "Neo-Retro",
        color: "bg-orange-900",
        description: "Ride Free. The FZ-X combines retro aesthetics with modern features like Traction Control and Y-Connect, making it the perfect companion for the urban explorer.",
        fullSpecs: {
            engine: "149cc, Air Cooled, 4-Stroke, SOHC, 2-Valve",
            power: "12.4 PS @ 7,250 RPM",
            torque: "13.3 Nm @ 5,500 RPM",
            transmission: "5-Speed",
            brakes: "Single Channel ABS",
            fuelCapacity: "10 Liters",
            weight: "139 kg",
            seatHeight: "810 mm",
            tyres: "100/80-17 (Front), 140/60-17 (Rear) Block Pattern",
            features: ["Traction Control System", "LED Headlight with DRL", "Y-Connect Bluetooth Connectivity"]
        }
    },
    {
        slug: "rayzr",
        name: "RayZR 125",
        variant: "Cyan Blue",
        price: "84,000",
        image: "/images/rayzr.png",
        specs: [
            { icon: Wind, label: "Hybrid Assist" },
            { icon: Gauge, label: "125cc Fi Engine" },
            { icon: Shield, label: "Unified Braking" }
        ],
        tag: "Street Rally",
        color: "bg-cyan-900",
        description: "The Tough Looking Scooter. RayZR 125 Fi Hybrid is designed to be lightweight and agile, featuring a hybrid system for that extra boost during acceleration.",
        fullSpecs: {
            engine: "125cc, Air Cooled, 4-Stroke, SOHC, 2-Valve",
            power: "8.2 PS @ 6,500 RPM",
            torque: "10.3 Nm @ 5,000 RPM",
            transmission: "V-Belt Automatic",
            brakes: "Unified Braking System (UBS)",
            fuelCapacity: "5.2 Liters",
            weight: "99 kg",
            seatHeight: "785 mm",
            tyres: "90/90-12 (Front), 110/90-10 (Rear)",
            features: ["Hybrid Power Assist", "SMG (Smart Motor Generator)", "Automatic Stop & Start System"]
        }
    },
    {
        slug: "fascino",
        name: "Fascino 125",
        variant: "Vivid Red",
        price: "79,000",
        image: "/images/fascino.png",
        specs: [
            { icon: Zap, label: "Stop & Start" },
            { icon: Binary, label: "99kg Weight" },
            { icon: Bike, label: "Classic Styling" }
        ],
        tag: "Fashionable",
        color: "bg-red-900",
        description: "A Style Icon. The Fascino 125 Fi Hybrid brings classic European styling to Indian roads, combined with modern fuel injection and hybrid technology.",
        fullSpecs: {
            engine: "125cc, Air Cooled, 4-Stroke, SOHC, 2-Valve",
            power: "8.2 PS @ 6,500 RPM",
            torque: "10.3 Nm @ 5,000 RPM",
            transmission: "V-Belt Automatic",
            brakes: "Unified Braking System (UBS)",
            fuelCapacity: "5.2 Liters",
            weight: "99 kg",
            seatHeight: "785 mm",
            tyres: "90/90-12 (Front), 110/90-10 (Rear)",
            features: ["Classic European Design", "Hybrid Power Assist", "V-Belt Automatic Transmission"]
        }
    }
];
