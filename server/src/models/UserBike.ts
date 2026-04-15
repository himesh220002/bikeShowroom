import mongoose, { Schema, Document } from 'mongoose';

export interface IModification {
    partName: string;
    brand: string;
    cost: number;
    date: Date;
    location?: string; // e.g., "Left Bin 2" for stock parts
}

export interface IDocument {
    docType: string;
    docUrl: string;
    expiryDate?: Date;
}

export interface IConsumables {
    tires: number; // 0-100
    chain: number;
    brakes: number;
    coolant: number;
}

export interface IUserBike extends Document {
    userId: mongoose.Types.ObjectId;
    bikeId?: mongoose.Types.ObjectId;
    bikeModel: string;
    bikeImage?: string;
    registrationNumber: string;
    chassisNumber?: string;
    purchaseDate: Date;
    lastServiceDate: Date;
    nextServiceDate: Date;
    nextServiceKm: number;
    mileage: number;
    lastMileage?: number;
    serviceCount: number;
    modifications: IModification[];
    documents: IDocument[];
    consumables: IConsumables;
    conditionScore: number;
    insuranceExpiry?: Date;
    createdAt: Date;
}

const UserBikeSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bikeId: { type: Schema.Types.ObjectId, ref: 'Bike' },
    bikeModel: { type: String, required: true },
    bikeImage: { type: String },
    registrationNumber: { type: String },
    chassisNumber: { type: String },
    purchaseDate: { type: Date, required: true },
    lastServiceDate: { type: Date },
    nextServiceDate: { type: Date },
    nextServiceKm: { type: Number },
    mileage: { type: Number, default: 0 },
    lastMileage: { type: Number },
    serviceCount: { type: Number, default: 0 },
    modifications: [{
        partName: { type: String, required: true },
        brand: { type: String },
        cost: { type: Number, default: 0 },
        date: { type: Date, default: Date.now },
        location: { type: String }
    }],
    documents: [{
        docType: { type: String, required: true },
        docUrl: { type: String, required: true },
        expiryDate: { type: Date }
    }],
    consumables: {
        tires: { type: Number, default: 100 },
        chain: { type: Number, default: 100 },
        brakes: { type: Number, default: 100 },
        coolant: { type: Number, default: 100 }
    },
    conditionScore: { type: Number, default: 100 },
    insuranceExpiry: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUserBike>('UserBike', UserBikeSchema);
