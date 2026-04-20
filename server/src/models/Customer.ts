import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    phone: string;
    email?: string;
    googleId?: string;
    avatar?: string;
    address?: string;
    preferredContact?: 'Phone' | 'WhatsApp' | 'Email';
    lifetimeValue?: number;
    feedbackScore?: number;
    nextServiceDue?: Date;
    reminderStatus?: string;
    reminderRemarks?: string;
    reminderCalled?: boolean;
    reminderMessaged?: boolean;
    engagement?: number;
    rating?: number;
    milestone?: string;
    lastUpdated?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    address: { type: String },
    preferredContact: { type: String, enum: ['Phone', 'WhatsApp', 'Email'], default: 'Phone' },
    lifetimeValue: { type: Number, default: 0 },
    feedbackScore: { type: Number, default: 0 },
    nextServiceDue: { type: Date },
    reminderStatus: { type: String },
    reminderRemarks: { type: String },
    reminderCalled: { type: Boolean, default: false },
    reminderMessaged: { type: Boolean, default: false },
    engagement: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    milestone: { type: String, default: 'New Customer' },
    lastUpdated: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'customers'
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
