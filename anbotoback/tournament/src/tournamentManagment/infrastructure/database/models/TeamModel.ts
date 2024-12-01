import mongoose, { Schema, Document } from "mongoose";

export interface Team extends Document {
    uuid: string;
    name: string;
    players: string[];
}

const TeamSchema = new Schema<Team>({
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    players: { type: [String], default: [] }
});

export const TeamModel = mongoose.model<Team>("Team", TeamSchema);