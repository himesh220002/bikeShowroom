import { Router } from 'express';
import Campaign from '../models/Campaign';
import Customer from '../models/Customer';

const router = Router();

// Get all campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 });
        res.json({ success: true, data: campaigns });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Launch a new campaign
router.post('/', async (req: any, res) => {
    try {
        const { name, type, content, recipientIds } = req.body;

        if (!recipientIds || recipientIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No recipients selected' });
        }

        // Create the campaign record
        const campaign = new Campaign({
            name,
            type,
            content,
            status: 'Sending',
            recipientsCount: recipientIds.length,
        });
        await campaign.save();

        // Respond immediately to the client
        res.json({ success: true, data: campaign });

        // Process in "background" (simulated for now)
        // In a real scenario, this would call Meta's API for each recipient
        let successCount = 0;
        let failureCount = 0;

        // Emit progress via socket if available
        if (req.io) {
            req.io.emit('campaign_started', { campaignId: campaign._id });
        }

        for (const id of recipientIds) {
            try {
                const customer = await Customer.findById(id);
                if (customer && customer.phone) {
                    // Simulate WhatsApp API call
                    // console.log(`Sending WhatsApp to ${customer.phone}: ${content}`);

                    // We'll simulate a 95% success rate for demonstration
                    const isSuccess = Math.random() > 0.05;
                    if (isSuccess) successCount++;
                    else failureCount++;
                } else {
                    failureCount++;
                }
            } catch (err) {
                failureCount++;
            }

            // Update stats intermittently if it's a large campaign
            if ((successCount + failureCount) % 5 === 0) {
                await Campaign.findByIdAndUpdate(campaign._id, {
                    successCount,
                    failureCount
                });
            }
        }

        // Final update
        await Campaign.findByIdAndUpdate(campaign._id, {
            status: 'Completed',
            successCount,
            failureCount,
            completedAt: new Date()
        });

        if (req.io) {
            req.io.emit('campaign_completed', {
                campaignId: campaign._id,
                successCount,
                failureCount
            });
        }

    } catch (error: any) {
        console.error("Campaign Launch Error:", error);
        // We don't use res.status here if it was already sent above
    }
});

export default router;
