import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
    customerId: mongoose.Types.ObjectId;
    name: string; // Denormalized for quick access
    phone: string; // Denormalized
    interests: string[];
    bikeModel?: string;
    message?: string;
    status: string;
    score: number;
    heat: string;
    source: string;
    followUpDate?: Date;
    assignedAgent?: string;
    escalationLevel?: 'Normal' | 'Urgent' | 'Management';
    conversionProbability?: number;
    adminNotes?: string;
    lastActivityDate?: Date;
    // UTM Tracking
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    notifyWhenAvailable?: boolean;
    preferredColor?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const InquirySchema: Schema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    interests: [{ type: String }],
    bikeModel: { type: String },
    message: { type: String },
    status: { type: String, default: 'New' },
    score: { type: Number, default: 0 },
    heat: { type: String, default: 'Cold' },
    source: { type: String, default: 'Web Inquiry' },
    followUpDate: { type: Date },
    assignedAgent: { type: String },
    escalationLevel: { type: String, enum: ['Normal', 'Urgent', 'Management'], default: 'Normal' },
    conversionProbability: { type: Number, default: 0 },
    adminNotes: { type: String },
    lastActivityDate: { type: Date, default: Date.now },
    // UTM Fields
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    utmContent: { type: String },
    utmTerm: { type: String },
    notifyWhenAvailable: { type: Boolean, default: false },
    preferredColor: { type: String },
}, {
    timestamps: true,
    collection: 'inquiries'
});

export default mongoose.model<IInquiry>('Inquiry', InquirySchema);
