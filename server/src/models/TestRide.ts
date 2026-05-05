import mongoose, { Schema, Document } from 'mongoose';

export interface ITestRide extends Document {
    name: string;
    phone: string;
    email?: string;
    bikeModel: string;
    preferredDate: Date;
    preferredTime: string;
    status: 'Unread' | 'Scheduled' | 'Completed' | 'Cancelled';
    notes?: string;
    adminRemarks?: string;
    staffRemark?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TestRideSchema: Schema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    bikeModel: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Unread', 'Scheduled', 'Completed', 'Cancelled'], 
        default: 'Unread' 
    },
    notes: { type: String },
    adminRemarks: { type: String },
    staffRemark: { type: String },
}, {
    timestamps: true,
    collection: 'test_rides'
});

export default mongoose.model<ITestRide>('TestRide', TestRideSchema);
