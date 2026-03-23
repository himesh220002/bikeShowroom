import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service';
import Customer from '../models/Customer';

dotenv.config();

const MONGO_URI = "mongodb+srv://satyamhimesh:06452220002Hq@cluster0.ckkeqng.mongodb.net/bikeYamahaDB";

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const today = "2026-03-23";
        // Delete only seeded ones or all for today to have a clean "useful data" look
        await Service.deleteMany({ appointmentDate: today });

        // Upsert a test customer
        let customer = await Customer.findOne({ phone: "9876543210" });
        if (!customer) {
            customer = new Customer({ name: "Rohan Sharma", phone: "9876543210" });
            await customer.save();
        }

        const services = [
            {
                customerId: customer._id,
                name: "Rohan Sharma",
                phone: "9876543210",
                bikeModel: "YZF R15 V4",
                regNumber: "BR 11 AB 1234",
                serviceType: "Periodic",
                status: "booked",
                priority: "Normal",
                appointmentDate: today,
                appointmentTime: "10:30",
                technicianName: "Rajesh K."
            },
            {
                customerId: customer._id,
                name: "Amit Kumar",
                phone: "9988776655",
                bikeModel: "MT-15 V2",
                regNumber: "BR 11 XY 5678",
                serviceType: "General",
                status: "in-progress",
                priority: "High",
                appointmentDate: today,
                appointmentTime: "11:00",
                technicianName: "Suresh M."
            },
            {
                customerId: customer._id,
                name: "Priya Singh",
                phone: "9122334455",
                bikeModel: "FZS FI V4",
                regNumber: "BR 11 MN 9012",
                serviceType: "Repair",
                status: "booked",
                priority: "Normal",
                appointmentDate: today,
                appointmentTime: "12:15",
                technicianName: "Amit P."
            },
            {
                customerId: customer._id,
                name: "Vikram Das",
                phone: "9555666777",
                bikeModel: "RayZR 125",
                regNumber: "BR 11 PQ 3456",
                serviceType: "Spares",
                status: "completed",
                priority: "Normal",
                appointmentDate: today,
                appointmentTime: "09:00",
                technicianName: "Rajesh K."
            },
            {
                customerId: customer._id,
                name: "Sandeep Jha",
                phone: "9888777666",
                bikeModel: "R15M",
                regNumber: "BR 11 JK 7890",
                serviceType: "Periodic",
                status: "in-progress",
                priority: "High",
                appointmentDate: today,
                appointmentTime: "14:00",
                technicianName: "Suresh M."
            }
        ];

        await Service.insertMany(services);
        console.log(`Successfully seeded ${services.length} services for ${today}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding services:', error);
        process.exit(1);
    }
}

seed();
