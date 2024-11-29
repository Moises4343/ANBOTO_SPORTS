import { Tournament } from "../entities/Tournament";

export interface TournamentRepository {
    createTournament(tournament: Tournament): Promise<any>;
    getTournament(): Promise<any>;
    cancelTournament(uuid: string): Promise<any>;
    registerATeam(teamUUID: string, uuid: string): Promise<any>;
    getTournamentDetails(uuid: string): Promise<any>;

    generateMatches(uuid: string): Promise<void>;

    registerMatchResults(
        uuid: string,
        roundName: string,
        results: Array<{ teamA: string; teamB: string; scoreA: number; scoreB: number }>
    ): Promise<void>;

    advanceRound(uuid: string): Promise<void>;

    finalizeTournament(uuid: string): Promise<void>;
}