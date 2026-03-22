import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    customerId: mongoose.Types.ObjectId;
    serviceType: string;
    bikeModel: string;
    regNumber: string;
    notes?: string;
    name: string;
    phone: string;
    status: string;
    priority: 'High' | 'Normal';
    appointmentDate: string;
    appointmentTime: string;
}

const ServiceSchema: Schema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    serviceType: { type: String, required: true },
    bikeModel: { type: String, required: true },
    regNumber: { type: String, required: true },
    notes: { type: String },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    priority: { type: String, enum: ['High', 'Normal'], default: 'Normal' },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
}, {
    timestamps: true,
    collection: 'service_bookings'
});

export default mongoose.model<IService>('Service', ServiceSchema);
