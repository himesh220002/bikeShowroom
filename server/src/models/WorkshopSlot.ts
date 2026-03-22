import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkshopSlot extends Document {
    date: string; // ISO Date YYYY-MM-DD
    slotTime: string; // HH:mm
    capacity: number;
    bookedCount: number;
}

const WorkshopSlotSchema: Schema = new Schema({
    date: { type: String, required: true },
    slotTime: { type: String, required: true },
    capacity: { type: Number, default: 5 },
    bookedCount: { type: Number, default: 0 }
});

// Compound index to ensure unique slots per day/time
WorkshopSlotSchema.index({ date: 1, slotTime: 1 }, { unique: true });

export default mongoose.model<IWorkshopSlot>('WorkshopSlot', WorkshopSlotSchema);
