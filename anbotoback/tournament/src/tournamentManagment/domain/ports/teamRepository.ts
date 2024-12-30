export interface TeamRepository {
    createTeam(uuid: string, name: string): Promise<void>;
    getTeamUUUID(uuid: string): Promise<any>;
    getNameTeam(uuid: string, playerUUID: string): Promise<any>;
    getMemberByTeam(uuid: string): Promise<any>;
    getIncompleteTeams(): Promise<any[]>;
    getAllTeams(): Promise<any[]>;
    getTeamsInTournaments(): Promise<any>;
    deleteTeam(uuid: string): Promise<void>;
    getTeamByUUID(uuid: string): Promise<{ createdBy: string } | null>;
}