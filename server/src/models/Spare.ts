import mongoose, { Schema, Document } from 'mongoose';

export interface ISpare extends Document {
    name: string;
    partNumber?: string;
    price: number;
    description: string;
    image: string;
    bikeIds: mongoose.Types.ObjectId[];
    category: string;
    subCategory?: string;
    stock: number;
    status: 'In Stock' | 'Out of Stock';
}

const SpareSchema: Schema = new Schema({
    name: { type: String, required: true },
    partNumber: { type: String },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    bikeIds: [{ type: Schema.Types.ObjectId, ref: 'Bike' }],
    category: { type: String, default: 'General' },
    subCategory: { type: String, enum: ['Apparels', 'Helmets', 'Accessories', ''], default: '' },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' }
}, { timestamps: true });

export default mongoose.model<ISpare>('Spare', SpareSchema);
