import mongoose, { Schema, Document } from 'mongoose';

export interface IAd extends Document {
    name: string;
    type: 'Poster' | 'Video' | 'Banner';
    image: string;
    description?: string;
    link: string;
    status: 'Active' | 'Scheduled' | 'Ended';
    impact: string; // e.g., "1.2k clicks"
}

const AdSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Poster', 'Video', 'Banner'], required: true },
    image: { type: String, required: true },
    description: { type: String },
    link: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Scheduled', 'Ended'], default: 'Scheduled' },
    impact: { type: String, default: '0' }
}, {
    timestamps: true
});

export default mongoose.model<IAd>('Ad', AdSchema);
