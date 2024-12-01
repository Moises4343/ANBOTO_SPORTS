import mongoose, { Schema, Document } from 'mongoose';

interface Match {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  winner: string | null;
}

interface Round {
  roundName: string;
  matches: Match[];
}

export interface ITournament extends Document {
  uuid: string;
  name: string;
  type: string;
  startDate: Date;
  endDate: Date;
  state: 'Proceso' | 'Finalizado' | 'Cancelado';
  teams: string[];
  rounds: Round[];
}

const MatchSchema: Schema<Match> = new Schema({
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  scoreA: { type: Number, required: true, default: 0 },
  scoreB: { type: Number, required: true, default: 0 },
  winner: { type: String, default: null }
});

const RoundSchema: Schema<Round> = new Schema({
  roundName: { type: String, required: true },
  matches: { type: [MatchSchema], default: [] }
});

const TournamentSchema: Schema<ITournament> = new Schema(
  {
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    state: {
      type: String,
      enum: ['Proceso', 'Finalizado', 'Cancelado'], 
      required: true,
    },
    teams: { type: [String], default: [] }, 
    rounds: { type: [RoundSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const TournamentModel = mongoose.model<ITournament>('Tournament', TournamentSchema);
