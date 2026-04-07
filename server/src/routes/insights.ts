import { Router } from 'express';
import Customer from '../models/Customer';
import Sale from '../models/Sale';
import Service from '../models/Service';
import mongoose from 'mongoose';

const router = Router();

router.get('/crm', async (req, res) => {
    try {
        // 1. Customer Growth (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const growthData = await Customer.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                    year: { $first: { $year: "$createdAt" } }
                }
            },
            { $sort: { year: 1, _id: 1 } }
        ]);

        // 2. Revenue by Brand (Bike Category)
        const revenueByBrand = await Sale.aggregate([
            {
                $group: {
                    _id: "$bikeName",
                    revenue: { $sum: "$salePrice" },
                    units: { $sum: 1 }
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        // 3. Service vs Sales Volume
        const monthlySales = await Sale.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    sales: { $sum: 1 }
                }
            }
        ]);

        const monthlyServices = await Service.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    services: { $sum: 1 }
                }
            }
        ]);

        // Merge Monthly Data
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const combinedMonthly = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const monthIdx = d.getMonth() + 1;
            const sales = monthlySales.find(m => m._id === monthIdx)?.sales || 0;
            const services = monthlyServices.find(m => m._id === monthIdx)?.services || 0;
            const growth = growthData.find(m => m._id === monthIdx)?.count || 0;

            return {
                name: months[monthIdx - 1],
                sales,
                services,
                growth
            };
        });

        res.json({
            success: true,
            data: {
                monthly: combinedMonthly,
                brandRevenue: revenueByBrand,
                overview: {
                    totalCustomers: await Customer.countDocuments(),
                    totalRevenue: revenueByBrand.reduce((acc, curr) => acc + curr.revenue, 0),
                    activeServices: await Service.countDocuments({ status: { $ne: 'Completed' } })
                }
            }
        });

    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
