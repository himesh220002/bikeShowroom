import mongoose, { Schema, Document } from 'mongoose';

export interface IUserBike extends Document {
    userId: mongoose.Types.ObjectId;
    bikeModel: string;
    registrationNumber: string;
    purchaseDate: Date;
    lastServiceDate?: Date;
    nextServiceDate?: Date;
    mileage?: number;
    lastMileage?: number;
    serviceCount: number;
    createdAt: Date;
}

const UserBikeSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bikeModel: { type: String, required: true },
    registrationNumber: { type: String },
    purchaseDate: { type: Date, required: true },
    lastServiceDate: { type: Date },
    nextServiceDate: { type: Date },
    mileage: { type: Number },
    lastMileage: { type: Number },
    serviceCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUserBike>('UserBike', UserBikeSchema);
