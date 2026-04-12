import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    customerId: mongoose.Types.ObjectId;
    serviceType: string;
    bikeModel: string;
    regNumber: string;
    notes?: string;
    name: string;
    phone: string;
    status: 'booked' | 'in-progress' | 'completed' | 'delivered' | 'cancelled' | 'deferred';
    priority: 'High' | 'Normal';
    technicianName?: string;
    appointmentDate: string;
    appointmentTime: string;
    estimatedCompletionTime?: string;
    statusHistory?: { status: string; timestamp: Date; notes?: string }[];
    bookedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    deliveredAt?: Date;
    cost: number;
    billingType: 'free' | 'paid';
    serviceNumber: number;   // 1-based count per phone+bikeModel; 1-4 = free, 5+ = paid
    rating?: number;
    ratedAt?: Date;
    feedback?: string;
    feedbackAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema: Schema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    serviceType: { type: String, required: true },
    bikeModel: { type: String, required: true },
    regNumber: { type: String, required: true },
    notes: { type: String },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
        type: String,
        enum: ['booked', 'in-progress', 'completed', 'delivered', 'cancelled', 'deferred'],
        default: 'booked'
    },
    priority: { type: String, enum: ['High', 'Normal'], default: 'Normal' },
    technicianName: { type: String },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    estimatedCompletionTime: { type: String },
    cost: { type: Number, default: 0 },
    billingType: { type: String, enum: ['free', 'paid'], default: 'paid' },
    serviceNumber: { type: Number, default: 1 },
    rating: { type: Number, min: 0, max: 10 },
    ratedAt: { type: Date },
    feedback: { type: String },
    feedbackAt: { type: Date },
    statusHistory: [{
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        notes: { type: String }
    }],
    bookedAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
    completedAt: { type: Date },
    deliveredAt: { type: Date },
}, {
    timestamps: true,
    collection: 'service_bookings'
});

export default mongoose.model<IService>('Service', ServiceSchema);
