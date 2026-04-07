import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
    name: string;
    type: 'Service' | 'Promotion' | 'Check-in' | 'Announcement';
    templateId?: string;
    content: string;
    status: 'Draft' | 'Scheduled' | 'Sending' | 'Completed' | 'Failed';
    recipientsCount: number;
    successCount: number;
    failureCount: number;
    scheduledAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const CampaignSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Service', 'Promotion', 'Check-in', 'Announcement'], required: true },
    templateId: { type: String },
    content: { type: String, required: true },
    status: { type: String, enum: ['Draft', 'Scheduled', 'Sending', 'Completed', 'Failed'], default: 'Draft' },
    recipientsCount: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
}, {
    timestamps: true,
    collection: 'campaigns'
});

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);
