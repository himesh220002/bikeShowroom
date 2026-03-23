import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    customerId: mongoose.Types.ObjectId;
    serviceType: string;
    bikeModel: string;
    regNumber: string;
    notes?: string;
    name: string;
    phone: string;
    status: 'booked' | 'in-progress' | 'completed' | 'delivered' | 'cancelled';
    priority: 'High' | 'Normal';
    technicianName?: string;
    appointmentDate: string;
    appointmentTime: string;
    bookedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    deliveredAt?: Date;
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
        enum: ['booked', 'in-progress', 'completed', 'delivered', 'cancelled'],
        default: 'booked'
    },
    priority: { type: String, enum: ['High', 'Normal'], default: 'Normal' },
    technicianName: { type: String },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    bookedAt: { type: Date, default: Date.now },
    startedAt: { type: Date },
    completedAt: { type: Date },
    deliveredAt: { type: Date },
}, {
    timestamps: true,
    collection: 'service_bookings'
});

export default mongoose.model<IService>('Service', ServiceSchema);
