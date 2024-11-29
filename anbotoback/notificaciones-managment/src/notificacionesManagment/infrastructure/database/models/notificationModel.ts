import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDocument extends Document {
    uuid: string;
    player_uuid: string;
    type: "CONGRATS" | "REQUEST";
    team_uuid?: string | null;
    createdAt: Date;
    message: string;
}

const NotificationSchema = new Schema<NotificationDocument>({
    uuid: { type: String, required: true, unique: true },
    player_uuid: { type: String, required: true },
    type: { type: String, required: true, enum: ["CONGRATS", "REQUEST"] },
    message: { type: String, required: true },
    team_uuid: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

export const NotificationModel = mongoose.model<NotificationDocument>("Notification", NotificationSchema);