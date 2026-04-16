import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
    name: string;
    email: string;
    phone: string;
    resumeUrl: string;
    aboutYourself: string;
    jobId: mongoose.Types.ObjectId;
    status: 'applied' | 'rejected' | 'shortlisted';
    appliedAt: Date;
}

const JobApplicationSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    aboutYourself: { type: String, required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'JobOpening', required: true },
    status: { type: String, enum: ['applied', 'rejected', 'shortlisted'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
