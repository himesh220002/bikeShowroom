import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    googleId: string;
    displayName: string;
    email: string;
    avatar: string;
    role: 'user' | 'admin';
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    googleId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
