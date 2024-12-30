import { Tournament } from "../../domain/entities/Tournament";
import { TournamentRepository } from "../../domain/ports/tournamentRepository";
import { PlayerModel } from "../database/models/PlayerModel";
import { TeamModel } from "../database/models/TeamModel";
import { TournamentModel } from "../database/models/TournamentModel";
import { CustomError } from "../error/error";

export class TournamentRepositoryImpl implements TournamentRepository {
  async createTournament(tournament: Tournament): Promise<any> {
    const tournamentData = {
      uuid: tournament.uuid,
      name: tournament.name,
      type: tournament.type,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      state: tournament.state,
      teams: tournament.teams
    };

    const newTournament = new TournamentModel(tournamentData);
    await newTournament.save();
  }

  async getTournament(): Promise<any> {
    const tournaments = await TournamentModel.find({ state: 'Proceso' });
    return tournaments;
  }

  async cancelTournament(uuid: string): Promise<any> {
    const tournament = await TournamentModel.findOne({ uuid });

    if (!tournament) {
      throw new CustomError(404, 'Torneo no encontrado');
    }

    if (tournament.state === 'Cancelado') {
      throw new CustomError(400, 'El torneo ya está cancelado');
    }

    tournament.state = 'Cancelado';

    await tournament.save();
  }

  async registerATeam(teamUUID: string, uuid: string): Promise<any> {
    const team = await TeamModel.findOne({ uuid: teamUUID });

    if (!team) {
      throw new CustomError(404, 'Equipo no encontrado');
    }

    const existingTournament = await TournamentModel.findOne({
      state: 'Proceso',
      teams: { $in: [teamUUID] },
    });

    if (existingTournament) {
      throw new CustomError(400, 'El equipo ya está registrado en un torneo en proceso');
    }

    /*const players = team.players;
    if (players.length !== 11) {
      throw new CustomError(400, 'El equipo debe tener exactamente 11 jugadores');
    }*/

    const tournament = await TournamentModel.findOne({
      uuid: uuid,
      state: 'Proceso',
      teams: { $ne: teamUUID },
    });

    if (!tournament) {
      throw new CustomError(404, 'No hay torneos disponibles o el equipo ya está registrado en este torneo');
    }

    if (tournament.teams.length > 8) {
      throw new CustomError(400, "Ya esta lleno este torneo, intenta otro");
    }

    tournament.teams.push(teamUUID);

    await tournament.save();
  }

  async getTournamentDetails(uuid: string): Promise<any> {
    const tournament = await TournamentModel.findOne({ uuid: uuid });

    if (!tournament) {
      throw new CustomError(404, "Torneo no existente");
    }

    const teams = await TeamModel.find({ uuid: { $in: tournament.teams } });

    const teamsWithPlayers = await Promise.all(
      teams.map(async (team) => {
        const players = await PlayerModel.find({ uuid: { $in: team.players } });

        return {
          teamName: team.name,
          players: players.map(player => ({
            uuid: player.uuid,
            name: player.name,
            lastname: player.lastname,
            email: player.email,
          }))
        };
      })
    );
    const roundsWithDetails = tournament.rounds.map(round => ({
      roundName: round.roundName,
      matches: round.matches.map(match => ({
        teamA: match.teamA,
        teamB: match.teamB,
        scoreA: match.scoreA,
        scoreB: match.scoreB,
        winner: match.winner
      }))
    }));

    return {
      tournamentName: tournament.name,
      state: tournament.state,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      teams: teamsWithPlayers,
      rounds: roundsWithDetails,
    };
  }

  async generateMatches(uuid: string): Promise<void> {
    const tournament = await TournamentModel.findOne({ uuid, state: "Proceso" });

    if (!tournament) {
      throw new CustomError(404, "Torneo no encontrado o no está en estado 'Proceso'.");
    }

    if (tournament.rounds.length === 0) {
      if (tournament.teams.length < 8) {
        throw new CustomError(400, "Se necesitan al menos 8 equipos para comenzar la primera ronda.");
      }

      const shuffledTeams = tournament.teams.sort(() => Math.random() - 0.5);
      const matches = [];

      for (let i = 0; i < shuffledTeams.length; i += 2) {
        if (shuffledTeams[i + 1]) { 
          matches.push({
            teamA: shuffledTeams[i],
            teamB: shuffledTeams[i + 1],
            scoreA: 0,
            scoreB: 0,
            winner: null
          });
        }
      }

      tournament.rounds.push({
        roundName: "Ronda 1",
        matches
      });
    } else {
      const lastRound = tournament.rounds[tournament.rounds.length - 1];

      const teams = lastRound.matches.map(m => m.winner).filter(winner => winner !== null);

      if (teams.length < 2) {
        throw new CustomError(400, "No hay suficientes equipos para generar una nueva ronda.");
      }

      const shuffledTeams = teams.sort(() => Math.random() - 0.5);
      const matches = [];

      for (let i = 0; i < shuffledTeams.length; i += 2) {
        if (shuffledTeams[i + 1]) { 
          matches.push({
            teamA: shuffledTeams[i],
            teamB: shuffledTeams[i + 1],
            scoreA: 0,
            scoreB: 0,
            winner: null
          });
        }
      }

      const nextRoundName = `Ronda ${tournament.rounds.length + 1}`;
      tournament.rounds.push({
        roundName: nextRoundName,
        matches
      });
    }

    await tournament.save();
  }


  async registerMatchResults(
    uuid: string,
    roundName: string,
    results: Array<{ teamA: string; teamB: string; scoreA: number; scoreB: number }>
  ): Promise<void> {
    const tournament = await TournamentModel.findOne({ uuid, state: "Proceso" });

    if (!tournament) {
      throw new CustomError(404, "Torneo no encontrado o no está en estado 'Proceso'.");
    }
    const round = tournament.rounds.find(r => r.roundName === roundName);

    if (!round) {
      throw new CustomError(404, `Ronda '${roundName}' no encontrada.`);
    }

    for (const result of results) {
      const match = round.matches.find(
        m => m.teamA === result.teamA && m.teamB === result.teamB
      );

      if (!match) {
        throw new CustomError(400, `El partido entre ${result.teamA} y ${result.teamB} no existe.`);
      }

      if (match.winner !== null) {
        throw new CustomError(400, `El partido entre ${result.teamA} y ${result.teamB} ya tiene un ganador registrado.`);
      }

      match.scoreA = result.scoreA;
      match.scoreB = result.scoreB;

      if (result.scoreA === result.scoreB) {
        throw new CustomError(400, `El partido entre ${result.teamA} y ${result.teamB} no puede terminar en empate.`);
      }

      match.winner = result.scoreA > result.scoreB ? result.teamA : result.teamB;
    }

    await tournament.save();
  }

  async advanceRound(uuid: string): Promise<void> {
    const tournament = await TournamentModel.findOne({ uuid, state: "Proceso" });

    if (!tournament) {
      throw new CustomError(404, "Torneo no encontrado o no está en estado 'Proceso'.");
    }

    if (tournament.rounds.length === 0) {
      throw new CustomError(400, "No se puede avanzar porque no hay rondas generadas.");
    }

    const lastRound = tournament.rounds[tournament.rounds.length - 1];

    const incompleteMatches = lastRound.matches.some(match => match.winner === null);
    if (incompleteMatches) {
      throw new CustomError(400, "No se puede avanzar porque hay partidos sin resultados.");
    }

    const winners = lastRound.matches.map(match => match.winner).filter(winner => winner !== null);

    if (winners.length < 2) {
      throw new CustomError(400, "No hay suficientes equipos para avanzar a la siguiente ronda.");
    }

    if (winners.length === 2) {
      tournament.rounds.push({
        roundName: "Final",
        matches: [
          {
            teamA: winners[0],
            teamB: winners[1],
            scoreA: 0,
            scoreB: 0,
            winner: null
          }
        ]
      });
    } else {
      const shuffledWinners = winners.sort(() => Math.random() - 0.5);
      const matches = [];
      for (let i = 0; i < shuffledWinners.length; i += 2) {
        if (shuffledWinners[i + 1]) { 
          matches.push({
            teamA: shuffledWinners[i],
            teamB: shuffledWinners[i + 1],
            scoreA: 0,
            scoreB: 0,
            winner: null
          });
        }
      }

      const nextRoundName = `Ronda ${tournament.rounds.length + 1}`;
      tournament.rounds.push({
        roundName: nextRoundName,
        matches
      });
    }

    await tournament.save();
  }


  async finalizeTournament(uuid: string): Promise<void> {
    const tournament = await TournamentModel.findOne({ uuid, state: "Proceso" });

    if (!tournament) {
      throw new CustomError(404, "Torneo no encontrado o no está en estado 'Proceso'.");
    }

    if (tournament.rounds.length === 0) {
      throw new CustomError(400, "No se puede finalizar un torneo sin rondas.");
    }

    const lastRound = tournament.rounds[tournament.rounds.length - 1];

    if (lastRound.roundName !== "Ronda 3") {
      throw new CustomError(400, "El torneo no puede finalizarse porque aún no se ha jugado la ronda final.");
    }

    if (lastRound.matches.length !== 1) {
      throw new CustomError(500, "La ronda final debe tener exactamente un partido.");
    }

    const finalMatch = lastRound.matches[0];
    if (finalMatch.winner === null) {
      throw new CustomError(400, "El torneo no puede finalizarse porque la final no tiene un ganador.");
    }

    tournament.state = "Finalizado";

    await tournament.save();
  }

}