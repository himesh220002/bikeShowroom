import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import leadsRouter from './routes/leads';
import bikesRouter from './routes/bikes';
import eventsRouter from './routes/events';
import servicesRouter from './routes/services';

import qualifiedLeadsRouter from './routes/qualifiedLeads';
import adsRouter from './routes/ads';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust for production
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB bikeYamahaDB'))
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

app.use('/api/leads', leadsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/qualified-leads', qualifiedLeadsRouter);
app.use('/api/bikes', bikesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/ads', adsRouter);

app.get('/', (req, res) => {
    res.send('Bike Showroom API is running with Socket.io...');
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { io };
