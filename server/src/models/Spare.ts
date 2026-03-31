import mongoose, { Schema, Document } from 'mongoose';

export interface ISpare extends Document {
    name: string;
    partNumber?: string;
    price: number;
    description: string;
    image: string;
    bikeId: mongoose.Types.ObjectId;
    category: string;
    stock: number;
    status: 'In Stock' | 'Out of Stock';
}

const SpareSchema: Schema = new Schema({
    name: { type: String, required: true },
    partNumber: { type: String },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    bikeId: { type: Schema.Types.ObjectId, ref: 'Bike' },
    category: { type: String, default: 'General' },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' }
}, { timestamps: true });

export default mongoose.model<ISpare>('Spare', SpareSchema);
