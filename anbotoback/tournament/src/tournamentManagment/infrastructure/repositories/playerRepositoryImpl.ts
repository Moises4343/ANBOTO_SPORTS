import bcrypt from "bcrypt";
import { Player } from "../../domain/entities/Player";
import { PlayerRepository } from "../../domain/ports/playerRepository";
import { PlayerModel } from "../database/models/PlayerModel";
import { CustomError } from "../error/error";
import { SenderService } from "../../application/senderService";
import { Team, TeamModel } from "../database/models/TeamModel";

export class PlayerRepositoryImpl implements PlayerRepository {
    constructor(readonly sender: SenderService){}

    async findByEmailOrPhone(email: string, phone: string): Promise<boolean> {
        const playerExists = await PlayerModel.exists({ $or: [{ email }, { phone }] });
        return playerExists !== null;
    }

    async create(player: Player): Promise<any> {
        const exists: boolean = await this.findByEmailOrPhone(player.email!, player.phone!);
        if(exists) throw new CustomError(400, "El correo electrónico o el número de teléfono ya están registrados.");

        try {
            const newPlayer = new PlayerModel({
                uuid: player.uuid,
                name: player.name,
                lastname: player.lastname,
                email: player.email,
                phone: player.phone,
                birthday: player.birthday,
                password: await bcrypt.hash(player.password!, 10),
                optCode: player.optCode,
                optExpired: player.optExpired,
                isActive: player.isActive,
                teamUUID: player.teamUUID,
            });

            await this.sender.sendMessage("create_player_notification_queue", {
                "to": player.email,
                "playerName": player.name + ' ' + player.lastname,
                "code": player.optCode
            });
            return await newPlayer.save();
        } catch (error: any) {
            throw error;
        }
    }

    async resendCode(email: string, code: string): Promise<any> {
        const player = await PlayerModel.findOne({ email });
        if (!player) {
            throw new CustomError(404, "El jugador con el correo proporcionado no existe.");
        }
        
        if (player.isActive) {
            throw new CustomError(400, "El jugador ya está activado. No se puede reenviar el código.");
        }
        
        try {
            player!.optCode = code;
            player!.optExpired = new Date(Date.now() + 5 * 60 * 1000);
            await player!.save();

            await this.sender.sendMessage("create_player_notification_queue", {
                to: player!.email,
                playerName: player!.name + " " + player!.lastname,
                code: player!.optCode,
            });
        } catch (error: any) {
            throw new CustomError(500, "Error al reintentar enviar el código OTP.");
        }
    }

    async validateCode(email: string, code: string): Promise<any> {
        const player = await PlayerModel.findOne({ email });
        if (!player) {
            throw new CustomError(404, "El jugador con el correo proporcionado no existe.");
        }
    
        if (player.isActive) {
            throw new CustomError(400, "El usuario ya está activo. No es necesario validar el código.");
        }
    
        const currentTime = new Date();
        if (player.optExpired && currentTime > player.optExpired) {
            throw new CustomError(400, "El código ingresado ha expirado.");
        }
    
        if (player.optCode !== code) {
            throw new CustomError(400, "El código ingresado es incorrecto.");
        }
    
        player.isActive = true;
        player.optCode = null; 
        player.optExpired = null;
        await player.save();
    }

    async login(email: string, password: string): Promise<{uuid: string, email: string}> {
        const player = await PlayerModel.findOne({ email });
        if (!player) {
            throw new CustomError(404, "El jugador con el correo proporcionado no existe.");
        }
    
        if (!player.isActive) {
            throw new CustomError(400, "El usuario aún no ha sido activado.");
        }
    
        const isPasswordValid = await bcrypt.compare(password, player.password!);
        if (!isPasswordValid) {
            throw new CustomError(401, "Credenciales incorrectas.");
        }
    
        return { uuid: player.uuid, email: player.email! };
    }

    async getPlayer(search: string): Promise<Player[]> {
        const players = await PlayerModel.find({
            $and: [
                { isActive: true },
                {
                    $or: [
                        { name: { $regex: `^${search}`, $options: "i" } },
                        { lastname: { $regex: `^${search}`, $options: "i" } },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $concat: ["$name", " ", "$lastname"] },
                                    regex: `^${search}`,
                                    options: "i"
                                }
                            }
                        }
                    ]
                }
            ]
        });
        
    
        return players.map((player) => new Player({
            uuid: player.uuid,
            name: player.name,
            lastname: player.lastname,
            email: player.email,
            phone: player.phone,
            birthday: player.birthday,
            isActive: player.isActive,
            teamUUID: player.teamUUID
        }));
    }

    async acceptInvitation(uuid: string, teamUUID: string): Promise<Team> {
        try {
            const team = await TeamModel.findOne({ uuid: teamUUID });

            if (!team) {
                throw new CustomError(404, "El equipo no existe.");
            }

            if (team.players.length >= 11) {
                throw new CustomError(400, "El equipo ya tiene el máximo de 11 jugadores.");
            }

            if (team.players.includes(uuid)) {
                throw new CustomError(400, "El jugador ya está en el equipo.");
            }

            const player = await PlayerModel.findOne({ uuid: uuid });

            if (!player) {
                throw new CustomError(404, "El jugador no existe.");
            }

            if (player.teamUUID) {
                throw new CustomError(400, "El jugador ya pertenece a un equipo.");
            }

            player.teamUUID = teamUUID;
            await player.save();

            team.players.push(uuid);
            await team.save();

            return team;
        } catch (error: any) {
            console.error("Error al aceptar la invitación:", error.message);
            throw new Error(error.message || "Error interno del servidor.");
        }
    }

    async leaveTeam(uuid: string, teamUUID: string): Promise<any> {
        const player = await PlayerModel.findOne({ uuid });

        if (!player) {
            throw new CustomError(404, 'Jugador no encontrado');
        }

        if (player.teamUUID !== teamUUID) {
            throw new CustomError(400, 'El jugador no pertenece a este equipo');
        }

        player.teamUUID = null;
        await player.save();

        const team = await TeamModel.findOne({ uuid: teamUUID });

        if (!team) {
            throw new CustomError(404, 'Equipo no encontrado');
        }

        team.players = team.players.filter(playerId => playerId !== uuid);
        await team.save();

        if (team.players.length === 0) {
            await TeamModel.deleteOne({ uuid: teamUUID });
        }
    }
}