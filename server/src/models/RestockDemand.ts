import mongoose, { Schema, Document } from 'mongoose';

export interface IRestockDemand extends Document {
    spareId: mongoose.Types.ObjectId;
    customerName?: string;
    customerPhone?: string;
    userId?: mongoose.Types.ObjectId;
    status: 'pending' | 'restocked' | 'ignored';
    createdAt: Date;
}

const RestockDemandSchema: Schema = new Schema({
    spareId: { type: Schema.Types.ObjectId, ref: 'Spare', required: true },
    customerName: { type: String },
    customerPhone: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'restocked', 'ignored'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model<IRestockDemand>('RestockDemand', RestockDemandSchema);
