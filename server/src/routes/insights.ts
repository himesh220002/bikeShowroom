import { Router } from 'express';
import Customer from '../models/Customer';
import Sale from '../models/Sale';
import Service from '../models/Service';
import Bike from '../models/Bike';
import Spare from '../models/Spare';
import RestockDemand from '../models/RestockDemand';
import Inquiry from '../models/Lead';
import mongoose from 'mongoose';

const router = Router();

router.get('/crm', async (req, res) => {
    try {
        const { period = '6months' } = req.query;

        const now = new Date();
        let startDate: Date;
        if (period === 'ytd') {
            startDate = new Date(now.getFullYear(), 0, 1);
        } else if (period === 'all') {
            startDate = new Date(0);
        } else {
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 6);
        }

        // Helper for numeric conversion of string prices
        const toNumericPrice = {
            $convert: {
                input: {
                    $replaceAll: {
                        input: { $replaceAll: { input: "$salePrice", find: "₹", replacement: "" } },
                        find: ",",
                        replacement: ""
                    }
                },
                to: "double",
                onError: 0,
                onNull: 0
            }
        };

        // 1. Sales Performance
        const salesDataQuery = await Sale.aggregate([
            { $match: { saleDate: { $gte: startDate } } },
            {
                $group: {
                    _id: { $month: "$saleDate" },
                    sales: { $sum: 1 },
                    revenue: { $sum: toNumericPrice }
                }
            }
        ]);

        // 2. Service Operations & Efficiency
        const serviceDataQuery = await Service.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    services: { $sum: 1 },
                    revenue: { $sum: "$cost" },
                    completed: { $sum: { $cond: [{ $in: ["$status", ["completed", "delivered"]] }, 1, 0] } },
                    cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } }
                }
            }
        ]);

        // 3. Customer Growth
        const growthData = await Customer.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Merge Monthly Data (handle up to 12 months if 'all' or 'ytd')
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthCount = period === 'all' ? 12 : (period === 'ytd' ? now.getMonth() + 1 : 6);

        const combinedMonthly = Array.from({ length: monthCount }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (monthCount - 1 - i));
            const monthIdx = d.getMonth() + 1;

            const sales = salesDataQuery.find(m => m._id === monthIdx)?.sales || 0;
            const services = serviceDataQuery.find(m => m._id === monthIdx)?.services || 0;
            const growth = growthData.find(m => m._id === monthIdx)?.count || 0;
            const target = Math.ceil(sales > 0 ? sales * 1.2 : 10);

            return {
                name: months[monthIdx - 1],
                sales,
                target,
                services,
                growth
            };
        });

        // 4. Lead Funnel
        const leadFunnelRaw = await Inquiry.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: "$status",
                    value: { $sum: 1 }
                }
            },
            { $sort: { value: -1 } }
        ]);

        // 5. Inventory
        const inventoryQuery = await Bike.aggregate([
            { $unwind: "$colors" },
            {
                $group: {
                    _id: "$name",
                    stock: { $sum: "$colors.stock" }
                }
            },
            { $sort: { stock: -1 } }
        ]);

        // 6. Finance
        const financeStatsRaw = await Sale.aggregate([
            { $match: { saleDate: { $gte: startDate } } },
            {
                $group: {
                    _id: "$paymentMethod",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 7. Overall Metrics
        const totalCustomers = await Customer.countDocuments({ createdAt: { $gte: startDate } });
        const totalSalesRevenue = salesDataQuery.reduce((acc, curr) => acc + curr.revenue, 0);

        // Precise Revenue Splitting: Accessories vs Service
        const completedServices = await Service.find({
            createdAt: { $gte: startDate },
            status: { $in: ['completed', 'delivered'] }
        });

        let actualAccessoryRevenue = 0;
        let actualServiceRevenue = 0;

        for (const s of completedServices) {
            // Accessory-focused jobs: entirely counted as accessory revenue
            if (['Spares', 'Accessory Sale'].includes(s.serviceType)) {
                actualAccessoryRevenue += s.cost;
            } else {
                // Service-focused jobs: split between labor (Service) and add-on items (Accessories)
                let accInThisJob = 0;
                if (s.items && Array.isArray(s.items)) {
                    accInThisJob = s.items.reduce((sum, item) => {
                        return item.itemType === 'accessory' ? sum + (item.price * (item.quantity || 1)) : sum;
                    }, 0);
                }
                actualAccessoryRevenue += accInThisJob;
                actualServiceRevenue += (s.cost - accInThisJob);
            }
        }

        const totalServices = serviceDataQuery.reduce((acc, curr) => acc + curr.services, 0);
        const totalCompleted = serviceDataQuery.reduce((acc, curr) => acc + curr.completed, 0);
        const totalCancelled = serviceDataQuery.reduce((acc, curr) => acc + curr.cancelled, 0);

        const serviceCompletionRate = totalServices > 0 ? Math.round((totalCompleted / totalServices) * 100) : 0;
        const noShowRate = totalServices > 0 ? Math.round((totalCancelled / totalServices) * 100) : 0;

        const healthyModels = inventoryQuery.filter(i => i.stock > 2).length;
        const inventoryHealth = inventoryQuery.length > 0 ? Math.round((healthyModels / inventoryQuery.length) * 100) : 0;

        const avgNPS = await Service.aggregate([
            { $match: { "feedback.rating": { $exists: true } } },
            { $group: { _id: null, avg: { $avg: "$feedback.rating" }, count: { $sum: 1 } } }
        ]);

        const recentFeedback = await Service.find({
            rating: { $exists: true },
            feedback: { $exists: true, $ne: "" }
        })
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('name bikeModel rating feedback updatedAt');

        res.json({
            success: true,
            data: {
                monthly: combinedMonthly,
                brandRevenue: await Sale.aggregate([
                    { $match: { saleDate: { $gte: startDate } } },
                    { $group: { _id: "$bikeName", revenue: { $sum: toNumericPrice }, units: { $sum: 1 } } },
                    { $sort: { revenue: -1 } }
                ]),
                leadFunnel: leadFunnelRaw.map(f => ({ stage: f._id, value: f.value })),
                inventory: inventoryQuery,
                recentFeedback,
                financeStats: financeStatsRaw,
                financialSplit: [
                    { name: 'Vehicle Sales', value: totalSalesRevenue },
                    { name: 'Service Revenue', value: actualServiceRevenue },
                    { name: 'Accessories', value: actualAccessoryRevenue }
                ],
                colorSales: await Sale.aggregate([
                    { $match: { saleDate: { $gte: startDate } } },
                    {
                        $group: {
                            _id: {
                                bike: "$bikeName",
                                color: "$variant",
                                month: { $month: "$saleDate" }
                            },
                            units: { $sum: 1 }
                        }
                    },
                    { $sort: { units: -1 } },
                    {
                        $group: {
                            _id: {
                                bike: "$_id.bike",
                                month: "$_id.month"
                            },
                            topColors: {
                                $push: {
                                    color: "$_id.color",
                                    units: "$units"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            topColors: { $slice: ["$topColors", 3] }
                        }
                    },
                    { $sort: { "_id.month": -1, "_id.bike": 1 } }
                ]),
                inventoryIntelligence: await (async () => {
                    const allBikes = await Bike.find().select('name colors.stock');
                    const bikeList = allBikes.map(b => ({
                        name: b.name,
                        stock: b.colors.reduce((sum, c) => sum + (c.stock || 0), 0)
                    }));

                    const days = Math.max(1, Math.round((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                    const salesByModel = await Sale.aggregate([
                        { $match: { saleDate: { $gte: startDate } } },
                        { $group: { _id: "$bikeName", units: { $sum: 1 } } }
                    ]);

                    const recentSalesByModel = await Sale.aggregate([
                        { $match: { saleDate: { $gte: thirtyDaysAgo } } },
                        { $group: { _id: "$bikeName", units: { $sum: 1 } } }
                    ]);

                    return bikeList.map(bike => {
                        const s = salesByModel.find(s => s._id === bike.name);
                        const unitsSold = s?.units || 0;

                        const recentS = recentSalesByModel.find(rs => rs._id === bike.name)?.units || 0;
                        const v = unitsSold / days;
                        const recentV = recentS / 30;

                        const effectiveV = Math.max(v, recentV);
                        const daysToOut = effectiveV > 0 ? Math.round(bike.stock / effectiveV) : 999;

                        return {
                            model: bike.name,
                            unitsSold,
                            recentUnitsSold: recentS,
                            velocity: v.toFixed(2),
                            recentVelocity: recentV.toFixed(2),
                            stock: bike.stock,
                            daysToOut,
                            status: daysToOut < 7 ? 'Critical' : (daysToOut < 15 ? 'Low' : 'Healthy')
                        };
                    }).sort((a, b) => a.daysToOut - b.daysToOut);
                })(),
                accessoryIntelligence: await (async () => {
                    // Updated filter: Include specific accessory categories OR anything with bikeId 'common' (universal)
                    const accessoryCategories = ['Accessory', 'Helmet', 'Body', 'General', 'Safety', 'Clothing', 'Merchandise', 'Protection'];
                    const accessories = await Spare.find({
                        $or: [
                            { category: { $in: accessoryCategories } },
                            { bikeId: null }, // Items not linked to a specific bike are often accessories
                            { bikeId: { $exists: false } }
                        ]
                    }).select('name stock category');
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                    // 1. Get Restock Demands by Accessory
                    const demandData = await RestockDemand.aggregate([
                        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                        { $group: { _id: "$spareId", count: { $sum: 1 } } }
                    ]);

                    // 2. Get Actual Usage from Services
                    const usageData = await Service.aggregate([
                        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                        { $unwind: "$items" },
                        { $match: { "items.itemType": "accessory" } },
                        { $group: { _id: "$items.itemId", count: { $sum: "$items.quantity" } } }
                    ]);

                    return accessories.map(acc => {
                        const demands = demandData.find(d => d._id?.toString() === acc._id.toString())?.count || 0;
                        const usage = usageData.find(u => u._id?.toString() === acc._id.toString())?.count || 0;
                        const totalDemand = demands + usage;

                        // Velocity is total demand (interest + sales) over 30 days
                        const velocity = totalDemand / 30;
                        const daysToOut = velocity > 0 ? Math.round(acc.stock / velocity) : 999;

                        return {
                            name: acc.name,
                            stock: acc.stock,
                            demand: totalDemand,
                            velocity: velocity.toFixed(2),
                            daysToOut,
                            status: acc.stock === 0 ? 'Out of Stock' : (daysToOut < 7 ? 'Critical' : (daysToOut < 15 ? 'Low' : 'Healthy'))
                        };
                    }).sort((a, b) => a.daysToOut - b.daysToOut);
                })(),
                modelColors: await Bike.find().select('name colors.name colors.hex'),
                overview: {
                    totalCustomers,
                    totalRevenue: totalSalesRevenue + actualServiceRevenue + actualAccessoryRevenue,
                    activeServices: await Service.countDocuments({ status: { $in: ['booked', 'in-progress'] } }),
                    nps: avgNPS[0]?.avg || 0,
                    npsCount: avgNPS[0]?.count || 0,
                    serviceCompletionRate,
                    inventoryHealth,
                    noShowRate,
                    revenueSplit: [
                        { name: 'Vehicle Sales', value: totalSalesRevenue, color: '#2D6AFF', scalingNote: 'Core volume driver. High revenue, but lower frequency.' },
                        { name: 'Service Revenue', value: actualServiceRevenue, color: '#10B981', scalingNote: 'Recurring revenue anchor. High margin opportunity.' },
                        { name: 'Accessories', value: actualAccessoryRevenue, color: '#F59E0B', scalingNote: 'Direct sales and add-ons. High growth potential.' }
                    ]
                }
            }
        });

    } catch (error: any) {
        console.error("Insights Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
