interface ServiceInterval {
    km: number;
    days: number;
}

interface Category {
    name: string;
    models: string[];
    intervals: ServiceInterval[];
}

const CATEGORIES: Category[] = [
    {
        name: "R-Series & MT",
        models: ["R15", "R15S", "R15 V4", "MT15", "MT15 V2", "MT-15"],
        intervals: [
            { km: 1000, days: 30 },
            { km: 5000, days: 150 },
            { km: 9000, days: 270 },
            { km: 13000, days: 390 }
        ]
    },
    {
        name: "FZ 250 Series",
        models: ["FZ 250", "FZS 250", "FZ25", "FZS25"],
        intervals: [
            { km: 1000, days: 60 },
            { km: 5000, days: 180 },
            { km: 10000, days: 360 }
        ]
    },
    {
        name: "FZ V3 Series",
        models: ["FZS V3", "FZ V3", "FZX", "FZ-S", "FZ-X", "FZS-FI"],
        intervals: [
            { km: 1000, days: 30 },
            { km: 4000, days: 150 },
            { km: 7000, days: 270 },
            { km: 10000, days: 390 }
        ]
    },
    {
        name: "125cc Scooters",
        models: ["Fascino", "Ray ZR", "RayZR", "Fascino 125", "Ray ZR 125"],
        intervals: [
            { km: 1000, days: 30 },
            { km: 4000, days: 150 },
            { km: 7000, days: 270 },
            { km: 10000, days: 390 },
            { km: 13000, days: 510 }
        ]
    }
];

export const findCategory = (model: string): Category => {
    const normalizedModel = model.toLowerCase().replace(/[\s-]/g, '');

    // 1. Try exact or substring match in models list
    for (const cat of CATEGORIES) {
        if (cat.models.some(m => {
            const normalizedM = m.toLowerCase().replace(/[\s-]/g, '');
            return normalizedModel.includes(normalizedM) || normalizedM.includes(normalizedModel);
        })) {
            return cat;
        }
    }

    // 2. Default to FZ V3 Series if no match (common middle ground)
    return CATEGORIES[2];
};

export const calculateNextService = (model: string, purchaseDate: Date, serviceCount: number) => {
    const category = findCategory(model);
    const intervals = category.intervals;

    // If all defined interval slots are used, default to every 6 months / 3000km from last
    if (serviceCount >= intervals.length) {
        return {
            nextKm: (intervals[intervals.length - 1].km) + (3000 * (serviceCount - intervals.length + 1)),
            nextDate: new Date(new Date(purchaseDate).getTime() + ((intervals[intervals.length - 1].days + (180 * (serviceCount - intervals.length + 1))) * 24 * 60 * 60 * 1000))
        };
    }

    const interval = intervals[serviceCount];
    return {
        nextKm: interval.km,
        nextDate: new Date(new Date(purchaseDate).getTime() + (interval.days * 24 * 60 * 60 * 1000))
    };
};
