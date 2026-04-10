import mongoose, { Schema, Document } from 'mongoose';

export interface IAd extends Document {
    name: string;
    type: 'Poster' | 'Video' | 'Banner';
    image: string;
    description?: string;
    link: string;
    status: 'Active' | 'Inactive' | 'Scheduled';
    impact: string;
    priority: number;
    month?: string;
    startDate?: Date;
    endDate?: Date;
}

const AdSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Poster', 'Video', 'Banner'], required: true },
    image: { type: String, required: true },
    description: { type: String },
    link: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive', 'Scheduled'], default: 'Scheduled' },
    impact: { type: String, default: '0' },
    priority: { type: Number, default: 0 },
    month: { type: String },
    startDate: { type: Date },
    endDate: { type: Date }
}, {
    timestamps: true
});

export default mongoose.model<IAd>('Ad', AdSchema);
