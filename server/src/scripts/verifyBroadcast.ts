import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/Customer';
import User from '../models/User';
import Campaign from '../models/Campaign';
import Notification from '../models/Notification';
import axios from 'axios';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bikeYamahaDB';
const API_URL = 'http://localhost:5000/api';

async function verify() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const testPhone = '9471283523';

        // 1. Ensure test customer exists
        let customer = await Customer.findOne({ phone: testPhone });
        if (!customer) {
            customer = new Customer({ name: 'Verification Test User', phone: testPhone });
            await customer.save();
            console.log('Created test customer');
        }

        // 2. Trigger broadcast via API
        console.log('Triggering broadcast...');
        const res = await axios.post(`${API_URL}/campaigns`, {
            name: "Verification Broadcast",
            type: "Testing",
            content: "Testing the real-time notification system. 🚀",
            recipientIds: [customer._id]
        });

        if ((res.data as any).success) {
            console.log('Broadcast triggered successfully');

            // Wait for processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 3. Verify Notification record
            const notification = await Notification.findOne({ userPhone: testPhone }).sort({ createdAt: -1 });
            if (notification) {
                console.log('SUCCESS: Notification record found!');
                console.log('Title:', notification.title);
                console.log('Message:', notification.message);
            } else {
                console.log('FAILURE: Notification record not found');
            }

            // 4. Verify Campaign record
            const campaign = await Campaign.findById((res.data as any).data._id);
            if (campaign && campaign.status === 'Completed') {
                console.log('SUCCESS: Campaign completed successfully');
            } else {
                console.log('Campaign status:', campaign?.status);
            }
        } else {
            console.error('Broadcast failed:', res.data);
        }

    } catch (err: any) {
        console.error('Verification error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
