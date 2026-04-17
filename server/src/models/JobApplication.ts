import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
    name: string;
    email: string;
    phone: string;
    resumeUrl: string;
    aboutYourself: string;
    linkedInProfile?: string;
    jobId: mongoose.Types.ObjectId;
    status: 'applied' | 'rejected' | 'shortlisted' | 'potential';
    immediateJoiner: boolean;
    noticePeriod?: string;
    experienceType: 'fresher' | 'professional';
    appliedAt: Date;
    viewed: boolean;
    ratings?: {
        skill: number;
        impression: number;
        education: number;
        profession: number;
        experience: number;
    };
    potentialTags?: string[];
}

const JobApplicationSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    aboutYourself: { type: String, required: true },
    linkedInProfile: { type: String },
    immediateJoiner: { type: Boolean, default: false },
    noticePeriod: { type: String },
    experienceType: { type: String, enum: ['fresher', 'professional'], default: 'fresher' },
    jobId: { type: Schema.Types.ObjectId, ref: 'JobOpening', required: true },
    status: { type: String, enum: ['applied', 'rejected', 'shortlisted', 'potential'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now },
    viewed: { type: Boolean, default: false },
    ratings: {
        skill: { type: Number, min: 0, max: 10 },
        impression: { type: Number, min: 0, max: 10 },
        education: { type: Number, min: 0, max: 10 },
        profession: { type: Number, min: 0, max: 10 },
        experience: { type: Number, min: 0, max: 10 }
    },
    potentialTags: [{ type: String }]
}, {
    timestamps: true
});

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
