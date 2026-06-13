import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import './config/passport';

import authRouter from './routes/auth';
import userBikesRouter from './routes/userBikes';
import leadsRouter from './routes/leads';
import bikesRouter from './routes/bikes';
import eventsRouter from './routes/events';
import servicesRouter from './routes/services';

import qualifiedLeadsRouter from './routes/qualifiedLeads';
import promosRouter from './routes/promos';
import salesRouter from './routes/sales';
import customersRouter from './routes/customers';
import configRouter from './routes/config';
import sparesRouter from './routes/spares';
import workshopSlotsRouter from './routes/workshopSlots';

import adminAuthRouter from './routes/adminAuthRoutes';
import campaignsRouter from './routes/campaigns';
import notificationsRouter from './routes/notifications';
import insightsRouter from './routes/insights';
import employeesRouter from './routes/employees';
import careerRouter from './routes/career';
import testRideRouter from './routes/testRideRoutes';
import bcrypt from 'bcryptjs';
import Config from './models/Config';

const app = express();
app.set('trust proxy', 1); // Enable trust proxy for Render/Vercel/load balancers

const httpServer = createServer(app);

// Get allowed origins from env
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://bike-showroom-client.vercel.app", // Added Vercel domain
    "https://cyphertech.online",
    "https://www.cyphertech.online",
];

if (process.env.CLIENT_URL) {
    allowedOrigins.push(...process.env.CLIENT_URL.split(',').map(o => o.trim()));
}

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/bikeYamahaDB';

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files from the public/uploads directory
const publicPath = path.join(__dirname, '../public');
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
}
app.use('/uploads', express.static(path.join(publicPath, 'uploads')));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'yamaha_secret_session',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production' || process.env.RENDER === 'true',
        sameSite: process.env.NODE_ENV === 'production' || process.env.RENDER === 'true' ? 'none' : 'lax'
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Successfully connected to MongoDB bikeYamahaDB');
        // Seed admin password if not exists
        const adminHash = await Config.findOne({ key: 'admin_password_hash' });
        if (!adminHash) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Yamaha123', salt);
            await Config.create({
                key: 'admin_password_hash',
                value: hashedPassword,
                description: 'Hashed administrative password'
            });
            console.log('Admin password initialized');
        }

        // Seed showroom contact info if not exists
        const showroomPhone = await Config.findOne({ key: 'showroomPhone' });
        if (!showroomPhone) {
            await Config.create({
                key: 'showroomPhone',
                value: '7004100062',
                description: 'Showroom WhatsApp Contact Number'
            });
        }
        const showroomEmail = await Config.findOne({ key: 'showroomEmail' });
        if (!showroomEmail) {
            await Config.create({
                key: 'showroomEmail',
                value: 'choudharyyamaha.ktr@gmail.com',
                description: 'Showroom Contact Email'
            });
        }

        // Seed service center info if not exists
        const servicePhone = await Config.findOne({ key: 'servicePhone' });
        if (!servicePhone) {
            await Config.create({
                key: 'servicePhone',
                value: '+919733327604',
                description: 'Service Center Contact Number'
            });
        }
        const serviceAddress = await Config.findOne({ key: 'serviceAddress' });
        if (!serviceAddress) {
            await Config.create({
                key: 'serviceAddress',
                value: 'CHOUDHARY YAMAHA Service Center, GHV4+WM6, Katihar-Manihari Rd, Barmasia Power House Colony, Lohiya Nagar, Katihar, Bihar 854105',
                description: 'Service Center Full Address'
            });
        }
        const serviceMap = await Config.findOne({ key: 'serviceMap' });
        if (!serviceMap) {
            await Config.create({
                key: 'serviceMap',
                value: 'https://share.google/EsFERqZuDrslGA3is',
                description: 'Service Center Google Maps URL'
            });
        }

        // Seed default workshop capacity
        const workshopCapacity = await Config.findOne({ key: 'workshop_default_capacity' });
        if (!workshopCapacity) {
            await Config.create({
                key: 'workshop_default_capacity',
                value: 4,
                description: 'Default capacity for workshop slots'
            });
            console.log('Default workshop capacity initialized to 4');
        }
    })
    .catch((err) => console.error('MongoDB connection error:', err));

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('Client connected to socket.io');

    socket.on('join', (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Middleware to inject io into routes if needed
app.use((req: any, res, next) => {
    req.io = io;
    next();
});

app.use('/api/auth', authRouter);
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/user-bikes', userBikesRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/qualified-leads', qualifiedLeadsRouter);
app.use('/api/bikes', bikesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/promos', promosRouter);
app.use('/api/sales', salesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/config', configRouter);
app.use('/api/spares', sparesRouter);
app.use('/api/workshop-slots', workshopSlotsRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/career', careerRouter);
app.use('/api/test-rides', testRideRouter);

app.get('/', (req, res) => {
    res.send('Bike Showroom API is running with Socket.io...');
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { io };
