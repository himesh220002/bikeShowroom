import mongoose, { Schema, Document } from 'mongoose';

export interface IColor {
    name: string;
    hex: string;
    image: string;
    colorOption: string;
    stock: number;
    price?: string; // Color-specific price
}

export interface ISpec {
    icon: string;
    label: string;
}

export interface IFullSpec {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    brakes: string;
    fuelCapacity: string;
    weight: string;
    seatHeight: string;
    tyres: string;
    topSpeed?: string;
    mileage?: string;
    features: string[];
}

export interface IBike extends Document {
    name: string;
    slug: string;
    category: 'bike' | 'scooty';
    tag: string;
    description: string;
    price: string;
    threeSixtyUrl?: string;
    threeSixtyImageCount?: number;
    colorBaseUrl?: string;
    colors: IColor[];
    specs: ISpec[];
    fullSpecs: IFullSpec;
    brochureUrl?: string;
}

const ColorSchema = new Schema({
    name: { type: String, required: true },
    hex: { type: String, required: true },
    image: { type: String, required: true },
    colorOption: { type: String, required: true },
    stock: { type: Number, default: 0 },
    price: { type: String } // Optional: Defaults to base price if not set
});

const BikeSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, enum: ['bike', 'scooty'], required: true },
    tag: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    threeSixtyUrl: { type: String },
    threeSixtyImageCount: { type: Number, default: 40 },
    colorBaseUrl: { type: String },
    colors: [ColorSchema],
    specs: [{
        icon: { type: String, required: true },
        label: { type: String, required: true }
    }],
    fullSpecs: { type: Schema.Types.Mixed, default: {} },
    brochureUrl: { type: String }
});

export default mongoose.model<IBike>('Bike', BikeSchema);
