import { Router } from 'express';
import Campaign from '../models/Campaign';
import Customer from '../models/Customer';
import Notification from '../models/Notification';
import { WhatsAppService } from '../utils/whatsappService';

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

        // Process in "background"
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
                    // 1. Send WhatsApp message
                    const waSuccess = await WhatsAppService.sendMessage(customer.phone, content);

                    // 2. Create Frontend Notification
                    const notification = new Notification({
                        userPhone: customer.phone,
                        title: name || 'New Announcement',
                        message: content,
                        type: 'broadcast'
                    });
                    await notification.save();

                    // 3. Emit real-time notification to the user's specific room
                    if (req.io) {
                        req.io.to(customer.phone).emit('new_notification', notification);
                        console.log(`Emitted notification to room: ${customer.phone}`);
                    }

                    if (waSuccess) successCount++;
                    else failureCount++;
                } else {
                    failureCount++;
                }
            } catch (err) {
                console.error(`Error processing recipient ${id}:`, err);
                failureCount++;
            }

            // Update stats intermittently
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
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
});

export default router;
