import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
    name: string;
    email: string;
    phone: string;
    resumeUrl: string;
    jobId: mongoose.Types.ObjectId;
    appliedAt: Date;
}

const JobApplicationSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'JobOpening', required: true },
    appliedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
