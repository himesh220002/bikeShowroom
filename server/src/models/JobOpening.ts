import mongoose, { Schema, Document } from 'mongoose';

export interface IJobOpening extends Document {
    title: string;
    description: string;
    location: string;
    status: string; // e.g., "Immediate Joining", "Training Provided"
    active: boolean;
    requirements: string[];
    createdAt: Date;
    updatedAt: Date;
}

const JobOpeningSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, default: 'Katihar Showroom' },
    status: { type: String, required: true },
    active: { type: Boolean, default: true },
    requirements: [{ type: String }]
}, {
    timestamps: true
});

export default mongoose.model<IJobOpening>('JobOpening', JobOpeningSchema);
