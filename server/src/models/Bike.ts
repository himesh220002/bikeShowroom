import mongoose, { Schema, Document } from 'mongoose';

export interface IBike extends Document {
    name: string;
    variant: string;
    price: string;
    image: string;
    tag: string;
    color: string;
    stock: number;
    category: 'bike' | 'scooty';
    brochureUrl?: string;
}

const BikeSchema: Schema = new Schema({
    name: { type: String, required: true },
    variant: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    tag: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String, enum: ['bike', 'scooty'], required: true },
    brochureUrl: { type: String }
});

// Allow multiple variants of the same bike name
BikeSchema.index({ name: 1, variant: 1 }, { unique: true });

export default mongoose.model<IBike>('Bike', BikeSchema);
