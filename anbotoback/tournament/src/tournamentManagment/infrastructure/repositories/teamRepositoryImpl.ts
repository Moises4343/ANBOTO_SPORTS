import { v4 as uuidv4 } from "uuid";
import { TeamRepository } from "../../domain/ports/teamRepository";
import { PlayerModel } from "../database/models/PlayerModel";
import { TeamModel } from "../database/models/TeamModel";
import { TournamentModel } from "../database/models/TournamentModel";
import { CustomError } from "../error/error";


export class TeamRepositoryImpl implements TeamRepository {
    async getMemberByTeam(uuid: string): Promise<any> {
        const team = await TeamModel.findOne({ uuid });

        if (!team) {
            throw new CustomError(404, 'Equipo no encontrado');
        }

        const playerIds = team.players;

        const players = await PlayerModel.find({ uuid: { $in: playerIds } });

        if (!players || players.length === 0) {
            throw new CustomError(404, 'No hay jugadores en este equipo');
        }

        return {name: team.name, players};
    }

    async teamExistsByName(name: string): Promise<boolean> {
        const team = await TeamModel.findOne({ name });
        return !!team;
    }


    async createTeam(uuid: string, name: string): Promise<void> {
        const player = await PlayerModel.findOne({ uuid: uuid });
        if (!player) throw new CustomError(404, "Jugador no encontrado.");
        //if(player.teamUUID != null) throw new CustomError(400, "Ya tienes un equipo creado actualmente");

        if (await this.teamExistsByName(name)) throw new CustomError(400, "Existe un equipo con ese nombre");
        const team = new TeamModel({ uuid: uuidv4(), name, players: [uuid], createdBy: uuid });
        await team.save();
        player.teamUUID = team.uuid;
        await player.save();
    }

    async getTeamUUUID(uuid: string): Promise<any> {
        const team = await TeamModel.findOne({ players: uuid }).select("uuid");

        if (!team) {
            return null;
        }

        return team.uuid;
    }

    async getNameTeam(uuid: string, playerUUID: string): Promise<any> {
        const team = await TeamModel.findOne({ uuid: uuid });

        if (!team) throw new CustomError(400, 'Equipo no existente');
        if (team.players.length > 11) throw new CustomError(400, "Equipo completo");
        if (team.players.find((player) => player == playerUUID)) throw new CustomError(400, "Ya esta integrado en el team");


        return team.name;
    }

    async getIncompleteTeams(): Promise<any[]> {
        const teams = await TeamModel.find({ $where: "this.players.length < 11" });
        return teams.map(team => ({
            uuid: team.uuid,
            name: team.name,
            createdBy: team.createdBy,
            currentPlayers: team.players.length,
            maxPlayers: 11,
        }));
    }

    async getAllTeams(): Promise<any[]> {
        const teams = await TeamModel.find();
        return teams.map(team => ({
            uuid: team.uuid,
            name: team.name,
            createdBy: team.createdBy,
            players: team.players,
        }));
    }

    async getTeamsInTournaments(): Promise<any> {
        const tournaments = await TournamentModel.find({ state: "Proceso" }).select("teams");
        const teamUUIDs = tournaments.flatMap(tournament => tournament.teams);
        const teams = await TeamModel.find({ uuid: { $in: teamUUIDs } });

        return teams;
    }

    async deleteTeam(uuid: string): Promise<void> {
        const team = await TeamModel.findOne({ uuid });
        if (!team) {
            throw new CustomError(404, "Equipo no encontrado.");
        }
    
        await TeamModel.deleteOne({ uuid });
    }

    async getTeamByUUID(uuid: string): Promise<{ createdBy: string } | null> {
        const team = await TeamModel.findOne({ uuid }).select("createdBy");
        if (!team) {
            return null;
        }
        return { createdBy: team.createdBy };
    }

    
    
}