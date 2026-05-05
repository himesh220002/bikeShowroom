import { Request, Response } from 'express';
import TestRide from '../models/TestRide';
import Lead from '../models/Lead';

export const createTestRide = async (req: Request, res: Response) => {
    try {
        const testRide = new TestRide(req.body);
        await testRide.save();

        // Notify via Socket.io if available
        const io = (req as any).io;
        if (io) {
            io.emit('new-test-ride', testRide);
        }

        res.status(201).json({ success: true, data: testRide });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getTestRides = async (req: Request, res: Response) => {
    try {
        const testRides = await TestRide.find().sort({ createdAt: -1 }).lean();
        
        // Find associated leads by phone for each test ride
        const phoneNumbers = testRides.map(tr => tr.phone);
        const leads = await Lead.find({ phone: { $in: phoneNumbers } }).lean();
        
        const dataWithLeads = testRides.map(tr => {
            const associatedLead = leads.find(l => l.phone === tr.phone);
            return {
                ...tr,
                associatedLead: associatedLead ? {
                    status: associatedLead.status,
                    heat: associatedLead.heat,
                    score: associatedLead.score,
                    _id: associatedLead._id
                } : null
            };
        });

        res.status(200).json({ success: true, data: dataWithLeads });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTestRideStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, adminRemarks, staffRemark } = req.body;
        const updateData: any = {};
        if (status) updateData.status = status;
        if (adminRemarks !== undefined) updateData.adminRemarks = adminRemarks;
        if (staffRemark !== undefined) updateData.staffRemark = staffRemark;

        const testRide = await TestRide.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!testRide) {
            return res.status(404).json({ success: false, message: 'Test ride request not found' });
        }

        res.status(200).json({ success: true, data: testRide });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getUnreadCount = async (req: Request, res: Response) => {
    try {
        const count = await TestRide.countDocuments({ status: 'Unread' });
        res.status(200).json({ success: true, count });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
