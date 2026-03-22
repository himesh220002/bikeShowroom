import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    phone: string;
    email?: string;
    googleId?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    googleId: { type: String },
    avatar: { type: String },
}, {
    timestamps: true,
    collection: 'customers'
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
