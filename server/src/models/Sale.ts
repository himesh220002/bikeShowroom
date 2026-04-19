import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
    customerId: mongoose.Types.ObjectId;
    bikeId: mongoose.Types.ObjectId;
    customerName: string;
    customerPhone: string;
    bikeName: string;
    variant: string;
    exShowroomPrice: string;
    insurance?: string;
    roadTax?: string;
    salePrice: string;
    saleDate: Date;
    extendedWarranty?: string;
    rsa?: string;
    hcCharge?: string;
    paymentMethod?: 'Cash' | 'Finance' | 'EMI' | 'UPI';
    financeProvider?: string;
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
    insurance: { type: String },
    roadTax: { type: String },
    salePrice: { type: String, required: true },
    saleDate: { type: Date, default: Date.now },
    extendedWarranty: { type: String, default: '0' },
    rsa: { type: String, default: '0' },
    hcCharge: { type: String, default: '0' },
    paymentMethod: { type: String, enum: ['Cash', 'Finance', 'EMI', 'UPI'], default: 'Cash' },
    financeProvider: { type: String },
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
