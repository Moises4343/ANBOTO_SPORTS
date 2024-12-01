import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
    uuid: string;
    name: string | null;
    lastname: string | null;
    email: string | null;
    phone: string | null;
    birthday: Date | null;
    password: string | null;
    optCode: string | null;
    optExpired: Date | null;
    isActive: boolean;
    teamUUID: string | null;
}

const PlayerSchema: Schema = new Schema({
    uuid: { type: String, required: true, unique: true },
    name: { type: String, default: null },
    lastname: { type: String, default: null },
    email: { type: String, unique: true, sparse: true, default: null },
    phone: { type: String, unique: true, sparse: true, default: null },
    birthday: { type: Date, default: null },
    password: { type: String, default: null },
    optCode: { type: String, default: null },
    optExpired: { type: Date, default: null },
    isActive: { type: Boolean, default: false },
    teamUUID: { type: String, default: null },
}, {
    timestamps: true,
});

export const PlayerModel = mongoose.model<IPlayer>('Player', PlayerSchema);