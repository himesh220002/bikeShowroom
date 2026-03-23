import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
    customerId: mongoose.Types.ObjectId;
    bikeId: mongoose.Types.ObjectId;
    customerName: string;
    customerPhone: string;
    bikeName: string;
    variant: string;
    salePrice: string;
    saleDate: Date;
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
    salePrice: { type: String, required: true },
    saleDate: { type: Date, default: Date.now },
}, {
    timestamps: true,
    collection: 'sales'
});

export default mongoose.model<ISale>('Sale', SaleSchema);
