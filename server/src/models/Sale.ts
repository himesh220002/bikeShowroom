import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
    customerId: mongoose.Types.ObjectId;
    bikeId: mongoose.Types.ObjectId;
    customerName: string;
    customerPhone: string;
    bikeName: string;
    variant: string;
    exShowroomPrice: string;
    rtoRegistration?: string;
    insurance?: string;
    roadTax?: string;
    salePrice: string;
    saleDate: Date;
    paymentMethod?: 'Cash' | 'Finance' | 'EMI' | 'UPI';
    invoiceNumber?: string;
    chassisNumber?: string;
    engineNumber?: string;
    salesperson?: string;

    deliveryDate?: Date;
    warrantyStart?: Date;
    warrantyEnd?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const SaleSchema: Schema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    bikeId: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    bikeName: { type: String, required: true },
    variant: { type: String, required: true },
    exShowroomPrice: { type: String, required: true },
    rtoRegistration: { type: String },
    insurance: { type: String },
    roadTax: { type: String },
    salePrice: { type: String, required: true },
    saleDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ['Cash', 'Finance', 'EMI', 'UPI'], default: 'Cash' },
    invoiceNumber: { type: String },
    chassisNumber: { type: String },
    engineNumber: { type: String },
    salesperson: { type: String },

    deliveryDate: { type: Date },
    warrantyStart: { type: Date },
    warrantyEnd: { type: Date },
}, {
    timestamps: true,
    collection: 'sales'
});

export default mongoose.model<ISale>('Sale', SaleSchema);
