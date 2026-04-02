import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
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
import adsRouter from './routes/ads';
import salesRouter from './routes/sales';
import customersRouter from './routes/customers';
import configRouter from './routes/config';
import sparesRouter from './routes/spares';

import adminAuthRouter from './routes/adminAuthRoutes';
import bcrypt from 'bcryptjs';
import Config from './models/Config';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust for production
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/bikeYamahaDB';

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'yamaha_secret_session',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production
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
    })
    .catch((err) => console.error('MongoDB connection error:', err));

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('Admin client connected to dashboard');
    socket.on('disconnect', () => {
        console.log('Admin client disconnected');
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
app.use('/api/ads', adsRouter);
app.use('/api/sales', salesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/config', configRouter);
app.use('/api/spares', sparesRouter);

app.get('/', (req, res) => {
    res.send('Bike Showroom API is running with Socket.io...');
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { io };
