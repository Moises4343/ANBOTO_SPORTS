import mongoose, { Document, Schema } from "mongoose";

export interface Team extends Document {
    uuid: string;
    name: string;
    players: string[];
    createdBy: string;
}

const TeamSchema = new Schema<Team>({
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    players: { type: [String], default: [] },
    createdBy: { type: String, required: true },
});

export const TeamModel = mongoose.model<Team>("Team", TeamSchema);