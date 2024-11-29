export interface TeamRepository {
    createTeam(uuid: string, name: string): Promise<void>;
    getTeamUUUID(uuid: string): Promise<any>;
    getNameTeam(uuid: string, playerUUID: string): Promise<any>;
    getMemberByTeam(uuid: string): Promise<any>;
}