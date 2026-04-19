import { Router } from 'express';
import Customer from '../models/Customer';
import Sale from '../models/Sale';
import Service from '../models/Service';
import Bike from '../models/Bike';
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
        const totalServiceRevenue = serviceDataQuery.reduce((acc, curr) => acc + curr.revenue, 0);

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
                    { name: 'Sales', value: totalSalesRevenue },
                    { name: 'Service', value: totalServiceRevenue },
                    { name: 'Accessories', value: totalSalesRevenue * 0.05 }
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
                modelColors: await Bike.find().select('name colors.name colors.hex'),
                overview: {
                    totalCustomers,
                    totalRevenue: totalSalesRevenue + totalServiceRevenue + (totalServiceRevenue * 0.15), // Including estimated Accessories (15% of service/spares)
                    activeServices: await Service.countDocuments({ status: { $in: ['booked', 'in-progress'] } }),
                    nps: avgNPS[0]?.avg || 0,
                    npsCount: avgNPS[0]?.count || 0,
                    serviceCompletionRate,
                    inventoryHealth,
                    noShowRate,
                    revenueSplit: [
                        { name: 'Vehicle Sales', value: totalSalesRevenue, color: '#2D6AFF', scalingNote: 'Core volume driver. High revenue, but lower frequency.' },
                        { name: 'Service Revenue', value: totalServiceRevenue, color: '#10B981', scalingNote: 'Recurring revenue anchor. High margin opportunity.' },
                        { name: 'Accessories', value: Math.round(totalServiceRevenue * 0.15), color: '#F59E0B', scalingNote: 'High Growth Potential. Currently estimated at 15% of service volume. Target: 25%.' }
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
