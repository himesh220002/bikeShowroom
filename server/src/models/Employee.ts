import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
    name: string;
    position: string;
    phone: string;
    email: string;
    imageUrl?: string;
    age?: number;
    gender?: string;
    joiningDate: Date;
    leavingDate?: Date;
    status: 'Active' | 'Resigned';
    history: Array<{
        date: Date;
        event: string;
        note: string;
    }>;
}

const EmployeeSchema: Schema = new Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String },
    age: { type: Number },
    gender: { type: String },
    joiningDate: { type: Date, required: true },
    leavingDate: { type: Date },
    status: { type: String, enum: ['Active', 'Resigned'], default: 'Active' },
    history: [{
        date: { type: Date, default: Date.now },
        event: { type: String },
        note: { type: String }
    }]
}, {
    timestamps: true
});

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
