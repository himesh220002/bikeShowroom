import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
    customerId: mongoose.Types.ObjectId;
    inquiryIds: mongoose.Types.ObjectId[];
    leadStage: "under-process" | "hot" | "cold";
    notes?: string;
    converted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema: Schema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    inquiryIds: [{ type: Schema.Types.ObjectId, ref: 'Inquiry' }],
    leadStage: {
        type: String,
        enum: ["under-process", "hot", "cold"],
        default: "under-process"
    },
    notes: { type: String },
    converted: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: 'leads'
});

export default mongoose.model<ILead>('Lead', LeadSchema);
