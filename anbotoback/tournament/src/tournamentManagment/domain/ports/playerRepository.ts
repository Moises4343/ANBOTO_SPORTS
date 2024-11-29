import { Team } from "../../infrastructure/database/models/TeamModel";
import { Player } from "../entities/Player";

export interface PlayerRepository {
    create(user: Player): Promise<any>;
    resendCode(email: string, code: string): Promise<any>;
    validateCode(email: string, code: string): Promise<any>;
    login(email: string, password: string): Promise<{uuid: string, email: string}>;
    getPlayer(name: string): Promise<Player[]>;
    acceptInvitation(uuid: string, teamUUID: string): Promise<Team>;
    leaveTeam(uuid: string, teamUUID: string): Promise<any>;
}