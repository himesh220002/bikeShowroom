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

        // 2. Create or Update Inquiry linked to Customer
        let inquiry;
        if (rest.source === 'Admin Manual') {
            inquiry = await Inquiry.findOne({ customerId: customer._id }).sort({ createdAt: -1 });
        }

        if (inquiry && inquiry.status !== 'Closed') {
            // Update existing inquiry
            inquiry.interests = Array.from(new Set([...inquiry.interests, ...(rest.interests || [])]));
            inquiry.status = rest.status || inquiry.status;
            inquiry.heat = rest.heat || inquiry.heat;
            inquiry.adminNotes = rest.adminNotes || inquiry.adminNotes;
            inquiry.lastActivityDate = new Date();
            inquiry.createdAt = new Date(); // Bring to top
            await inquiry.save();
        } else {
            // Create new Inquiry
            inquiry = new Inquiry({
                ...rest,
                name,
                phone,
                customerId: customer._id
            });
            await inquiry.save();
        }

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

router.put('/:id', async (req, res) => {
    try {
        const lead = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

        res.json({ success: true, data: lead });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const lead = await Inquiry.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: 'Inquiry not found' });

        res.json({ success: true, message: 'Inquiry discarded successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/manual-escalate', async (req, res) => {
    try {
        const { inquiryId, name, phone, interests, status, heat, adminNotes } = req.body;

        // 1. Update existing inquiry
        const inquiry = await Inquiry.findByIdAndUpdate(inquiryId, {
            name, phone, interests, status, heat, adminNotes,
            lastActivityDate: new Date()
        }, { new: true });

        if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });

        // 2. Find/Create Hot Lead (LeadReal)
        let lead = await Lead.findOne({ customerId: inquiry.customerId });
        if (!lead) {
            lead = new Lead({
                customerId: inquiry.customerId,
                inquiryIds: [inquiry._id],
                leadStage: "hot",
                notes: adminNotes
            });
        } else {
            if (!lead.inquiryIds.includes(inquiry._id as any)) {
                lead.inquiryIds.push(inquiry._id as any);
            }
            lead.leadStage = "hot";
            lead.notes = adminNotes;
        }
        await lead.save();

        const io = (req as any).io;
        if (io) {
            io.emit('lead_escalated', {
                customer: { name: inquiry.name, _id: inquiry.customerId },
                inquiry,
                lead
            });
        }

        res.json({ success: true, data: lead });
    } catch (error: any) {
        console.error("Error in manual-escalate:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
