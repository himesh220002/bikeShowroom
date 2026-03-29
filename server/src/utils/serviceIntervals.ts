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
        name: "Standard Yamaha (R, MT, FZ, Scooters)",
        models: ["R15", "MT15", "FZ", "FZS", "FZX", "Fascino", "RayZR", "Aerox"],
        intervals: [
            { km: 1000, days: 30 },
            { km: 5000, days: 150 },
            { km: 9000, days: 270 },
            { km: 13000, days: 390 }
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

    // 2. Default to Standard
    return CATEGORIES[0];
};

export const calculateNextService = (model: string, purchaseDate: Date, serviceCount: number) => {
    const category = findCategory(model);
    const intervals = category.intervals;

    // If all defined interval slots are used, default to every 120 days / 4000km from last
    if (serviceCount >= intervals.length) {
        const lastInterval = intervals[intervals.length - 1];
        const extraCount = serviceCount - intervals.length + 1;
        return {
            nextKm: lastInterval.km + (4000 * extraCount),
            nextDate: new Date(new Date(purchaseDate).getTime() + ((lastInterval.days + (120 * extraCount)) * 24 * 60 * 60 * 1000))
        };
    }

    const interval = intervals[serviceCount];
    return {
        nextKm: interval.km,
        nextDate: new Date(new Date(purchaseDate).getTime() + (interval.days * 24 * 60 * 60 * 1000))
    };
};
