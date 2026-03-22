import { Router } from 'express';
import Inquiry from '../models/Lead';
import Customer from '../models/Customer';
import Lead from '../models/LeadReal';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { name, phone, email, ...rest } = req.body;

        // 1. Upsert Customer
        let customer = await Customer.findOne({ phone });
        if (!customer) {
            customer = new Customer({ name, phone, email });
            await customer.save();
        } else if (email && !customer.email) {
            customer.email = email;
            await customer.save();
        }

        // 2. Create Inquiry linked to Customer
        const inquiry = new Inquiry({
            ...rest,
            name,
            phone,
            customerId: customer._id
        });
        await inquiry.save();

        // 3. Auto-Escalation Logic (Repeat Inquiry Detection)
        const inquiryCount = await Inquiry.countDocuments({ customerId: customer._id });

        if (inquiryCount > 1) {
            let lead = await Lead.findOne({ customerId: customer._id });
            if (!lead) {
                lead = new Lead({
                    customerId: customer._id,
                    inquiryIds: [inquiry._id],
                    leadStage: "hot"
                });
            } else {
                if (!lead.inquiryIds.includes(inquiry._id as any)) {
                    lead.inquiryIds.push(inquiry._id as any);
                }
                lead.leadStage = "hot";
            }
            await lead.save();

            const io = (req as any).io;
            if (io) {
                io.emit('lead_escalated', {
                    customer,
                    inquiry,
                    lead
                });
            }
        }

        const io = (req as any).io;
        if (io) {
            io.emit('new_lead', inquiry);
        }

        res.status(201).json({ success: true, data: inquiry });
    } catch (error: any) {
        console.error("Error creating inquiry:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().populate('customerId').sort({ createdAt: -1 });
        res.json({ success: true, data: inquiries });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
