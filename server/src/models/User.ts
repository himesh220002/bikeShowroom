import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    googleId?: string;
    displayName: string;
    email: string;
    password?: string;
    avatar?: string;
    phone?: string;
    role: 'user' | 'admin';
    authProvider: 'google' | 'local';
    vaultPin?: string;
    createdAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
    compareVaultPin: (pin: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    googleId: { type: String, unique: true, sparse: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    authProvider: { type: String, enum: ['google', 'local'], default: 'google' },
    vaultPin: { type: String },
    createdAt: { type: Date, default: Date.now },
}).index({ googleId: 1 }, { unique: true, sparse: true });

// Hash password and vault pin before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password!, salt);
        } catch (err: any) {
            return next(err);
        }
    }
    if (this.isModified('vaultPin')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.vaultPin = await bcrypt.hash(this.vaultPin!, salt);
        } catch (err: any) {
            return next(err);
        }
    }
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string) {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
};

// Compare vault pin method
UserSchema.methods.compareVaultPin = async function (pin: string) {
    if (!this.vaultPin) return false;
    return bcrypt.compare(pin, this.vaultPin);
};

export default mongoose.model<IUser>('User', UserSchema);
