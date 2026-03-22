import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
    customerId: mongoose.Types.ObjectId;
    name: string; // Denormalized for quick access
    phone: string; // Denormalized
    interests: string[];
    message?: string;
    status: string;
    score: number;
    heat: string;
    source: string;
}

const InquirySchema: Schema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    interests: [{ type: String }],
    message: { type: String },
    status: { type: String, default: 'New' },
    score: { type: Number, default: 0 },
    heat: { type: String, default: 'Cold' },
    source: { type: String, default: 'Web Inquiry' },
}, {
    timestamps: true,
    collection: 'inquiries'
});

export default mongoose.model<IInquiry>('Inquiry', InquirySchema);
