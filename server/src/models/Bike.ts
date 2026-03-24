import mongoose, { Schema, Document } from 'mongoose';

export interface IColor {
    name: string;
    hex: string;
    image: string;
    colorOption: string;
    stock: number;
}

export interface IBike extends Document {
    name: string;
    category: 'bike' | 'scooty';
    tag: string;
    description: string;
    price: string;
    threeSixtyUrl?: string;
    threeSixtyImageCount?: number;
    colors: IColor[];
    brochureUrl?: string;
}

const ColorSchema = new Schema({
    name: { type: String, required: true },
    hex: { type: String, required: true },
    image: { type: String, required: true },
    colorOption: { type: String, required: true },
    stock: { type: Number, default: 0 }
});

const BikeSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, enum: ['bike', 'scooty'], required: true },
    tag: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    threeSixtyUrl: { type: String },
    threeSixtyImageCount: { type: Number, default: 40 },
    colors: [ColorSchema],
    brochureUrl: { type: String }
});

export default mongoose.model<IBike>('Bike', BikeSchema);
