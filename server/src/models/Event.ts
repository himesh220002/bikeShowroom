import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    type: string;
    description: string;
    timestamp: Date;
}

const EventSchema: Schema = new Schema({
    type: { type: String, required: true },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IEvent>('Event', EventSchema);
