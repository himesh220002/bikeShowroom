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

export interface IPartStatus {
    part: string;
    status: 'healthy' | 'watch' | 'critical' | 'fixed';
    note?: string;
    updatedAt: Date;
}

export interface IIssueReport {
    title: string;
    system: string;
    severity: 'low' | 'medium' | 'high';
    status: 'open' | 'in_progress' | 'fixed';
    observedAt: Date;
    fixedAt?: Date;
    note?: string;
}

export interface IDiagnosticReport {
    title: string;
    summary: string;
    healthScore: number;
    generatedAt: Date;
}

export interface IRideAnalytics {
    periodLabel: string;
    distanceKm: number;
    efficiencyKmpl: number;
    activeHours: number;
    generatedAt: Date;
}

export interface IUserBike extends Document {
    userId: mongoose.Types.ObjectId;
    bikeId?: mongoose.Types.ObjectId;
    bikeModel: string;
    bikeImage?: string;
    registrationNumber: string;
    registrationVerified?: boolean;
    chassisNumber?: string;
    identitySource?: 'owner' | 'sale_ledger';
    salePrice?: number;
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
    partStatuses: IPartStatus[];
    issueReports: IIssueReport[];
    diagnosticReports: IDiagnosticReport[];
    rideAnalytics: IRideAnalytics[];
    insuranceExpiry?: Date;
    createdAt: Date;
}

const UserBikeSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bikeId: { type: Schema.Types.ObjectId, ref: 'Bike' },
    bikeModel: { type: String, required: true },
    bikeImage: { type: String },
    registrationNumber: { type: String },
    registrationVerified: { type: Boolean, default: false },
    chassisNumber: { type: String },
    identitySource: { type: String, enum: ['owner', 'sale_ledger'], default: 'owner' },
    salePrice: { type: Number },
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
    partStatuses: [{
        part: { type: String, required: true },
        status: { type: String, enum: ['healthy', 'watch', 'critical', 'fixed'], required: true },
        note: { type: String },
        updatedAt: { type: Date, default: Date.now }
    }],
    issueReports: [{
        title: { type: String, required: true },
        system: { type: String, required: true },
        severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        status: { type: String, enum: ['open', 'in_progress', 'fixed'], default: 'open' },
        observedAt: { type: Date, default: Date.now },
        fixedAt: { type: Date },
        note: { type: String }
    }],
    diagnosticReports: [{
        title: { type: String, required: true },
        summary: { type: String, required: true },
        healthScore: { type: Number, min: 0, max: 100, default: 100 },
        generatedAt: { type: Date, default: Date.now }
    }],
    rideAnalytics: [{
        periodLabel: { type: String, required: true },
        distanceKm: { type: Number, default: 0 },
        efficiencyKmpl: { type: Number, default: 0 },
        activeHours: { type: Number, default: 0 },
        generatedAt: { type: Date, default: Date.now }
    }],
    insuranceExpiry: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUserBike>('UserBike', UserBikeSchema);
