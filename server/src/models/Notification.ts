import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userPhone: string;
    title: string;
    message: string;
    type: 'broadcast' | 'system' | 'service';
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    userPhone: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['broadcast', 'system', 'service'], default: 'broadcast' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
