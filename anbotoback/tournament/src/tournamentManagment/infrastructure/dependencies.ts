import { connectRabbit } from "./rabbitmq/rabbit";
import { RabbitMQService } from "./rabbitmq/senderService";
import { SenderService } from "../application/senderService";
import { PlayerRepository } from "../domain/ports/playerRepository";
import { PlayerRepositoryImpl } from "./repositories/playerRepositoryImpl";
import { CreatePlayerUseCase } from "../application/createPlayerUseCase";
import { CreatePlayerController } from "./controllers/createPlayerController";
import { ResendEmailCodeUseCase } from "../application/resendEmailCodeUseCase";
import { ResendEmailCodeController } from "./controllers/resendEmailCodeController";
import { ValidateCodeUseCase } from "../application/validateCodeUseCase";
import { ValidateCodeController } from "./controllers/validateCodeController";
import { LoginPlayerUseCase } from "../application/loginPlayerUseCase";
import { TokenService } from "../application/tokenService";
import { JWTTokenService } from "./token/JWTTokenService";
import { LoginPlayerController } from "./controllers/loginPlayerController";
import { GetPlayersUseCase } from "../application/getPlayersUseCase";
import { GetPlayersController } from "./controllers/getPlayersController";
import { TeamRepository } from "../domain/ports/teamRepository";
import { TeamRepositoryImpl } from "./repositories/teamRepositoryImpl";
import { CreateTeamUseCase } from "../application/createTeamUseCase";
import { CreateTeamController } from "./controllers/createTeamController";
import { InviteJoinTeamUseCase } from "../application/inviteJoinTeamUseCase";
import { InviteJointTeamController } from "./controllers/inviteJoinTeamController";
import { AcceptInvitationUseCase } from "../application/accepteInvitationUseCase";
import { AcceptInvitationController } from "./controllers/acceptInvitationController";
import { DeletePlayerTeamUseCase } from "../application/deletePlayerTeamUseCase";
import { DeletePlayerTeamController } from "./controllers/deletePlayerTeamController";
import { GetMembersByTeamUseCase } from "../application/getMemberByTeamUseCase";
import { GetMembersByTeamController } from "./controllers/getMembersByTeamController";
import { TournamentRepository } from "../domain/ports/tournamentRepository";
import { TournamentRepositoryImpl } from "./repositories/tournamentRepositoryImpl";
import { CreateTournamentUseCase } from "../application/createTournamentUseCase";
import { CreateTournamentController } from "./controllers/createTournamentController";
import { GetTournamentsUseCase } from "../application/getTournamentsUseCase";
import { GetTournamentsController } from "./controllers/getTournamentsController";
import { CancelTournamentUseCase } from "../application/cancelTournamentUseCase";
import { CancelTournamentController } from "./controllers/cancelTournamentController";
import { RegisterTeamTournamentUseCase } from "../application/registerTeamTournamentUseCase";
import { RegisterTeamTournamentController } from "./controllers/registerTeamTournamentController";
import { GetDetailsTournamentUseCase } from "../application/getDetailsTournamentUseCase";
import { GetDetailsTournamentController } from "./controllers/getDetailsTournamentController";
import { AdvanceRoundUseCase } from "../application/advancedRoundUseCase";
import { FinalizeTournamentUseCase } from "../application/finalizeTournamentUseCase";
import { GenerateMatchesUseCase } from "../application/generedMatchesUseCase";
import { RegisterMatchResultsUseCase } from "../application/registerMatchUseCase";
import { GenerateMatchesController } from "./controllers/generatedMatchesController";
import { RegisterMatchResultsController } from "./controllers/registerMatchController";
import { AdvanceRoundController } from "./controllers/advancedRoundController";
import { FinalizeTournamentController } from "./controllers/finalizeTournamentController";


export const initializeDependencies = async () => {
    const rabbitConnection = await connectRabbit();
    const senderService: SenderService = new RabbitMQService(rabbitConnection);
    const tokenService: TokenService = new JWTTokenService("miContraseñaSuperSegura$123");

    const playerRepository: PlayerRepository = new PlayerRepositoryImpl(senderService);
    const teamRepository: TeamRepository = new TeamRepositoryImpl();
    const tournamentRepository: TournamentRepository = new TournamentRepositoryImpl();

    const createPlayerUseCase: CreatePlayerUseCase = new CreatePlayerUseCase(playerRepository);
    const resendEmailCodeUseCase: ResendEmailCodeUseCase = new ResendEmailCodeUseCase(playerRepository);
    const validateCodeUseCase: ValidateCodeUseCase = new ValidateCodeUseCase(playerRepository);
    const loginPlayerUseCase: LoginPlayerUseCase = new LoginPlayerUseCase(playerRepository, tokenService, teamRepository);
    const getPlayersUseCase: GetPlayersUseCase = new GetPlayersUseCase(playerRepository);
    const createTeamUseCase: CreateTeamUseCase = new CreateTeamUseCase(teamRepository);
    const inviteJoinTeamUseCase: InviteJoinTeamUseCase = new InviteJoinTeamUseCase(senderService, teamRepository);
    const acceptInvitationUseCase: AcceptInvitationUseCase = new AcceptInvitationUseCase(playerRepository, senderService);
    const leaveTeamUseCase: DeletePlayerTeamUseCase = new DeletePlayerTeamUseCase(playerRepository);
    const getMembersByTeamUseCase: GetMembersByTeamUseCase = new GetMembersByTeamUseCase(teamRepository);
    const createTournamentUseCase: CreateTournamentUseCase = new CreateTournamentUseCase(tournamentRepository);
    const getTournamentsUseCase: GetTournamentsUseCase = new GetTournamentsUseCase(tournamentRepository);
    const cancelTournamentUseCase: CancelTournamentUseCase = new CancelTournamentUseCase(tournamentRepository);
    const registerTeamTournamentUseCase: RegisterTeamTournamentUseCase = new RegisterTeamTournamentUseCase(tournamentRepository);
    const getDetailsTournamentUseCase: GetDetailsTournamentUseCase = new GetDetailsTournamentUseCase(tournamentRepository);
    const generateMatchesUseCase: GenerateMatchesUseCase  = new GenerateMatchesUseCase(tournamentRepository);
    const registerMatchResultsUseCase: RegisterMatchResultsUseCase = new RegisterMatchResultsUseCase(tournamentRepository);
    const advanceRoundUseCase: AdvanceRoundUseCase = new AdvanceRoundUseCase(tournamentRepository);
    const finalizeTournamentUseCase: FinalizeTournamentUseCase = new FinalizeTournamentUseCase(tournamentRepository);


    const createPlayerController: CreatePlayerController = new CreatePlayerController(createPlayerUseCase);
    const resendEmailCodeController: ResendEmailCodeController = new ResendEmailCodeController(resendEmailCodeUseCase);
    const validateCodeController: ValidateCodeController = new ValidateCodeController(validateCodeUseCase);
    const loginPlayerController: LoginPlayerController = new LoginPlayerController(loginPlayerUseCase);
    const getPlayersController: GetPlayersController = new GetPlayersController(getPlayersUseCase, tokenService);
    const createTeamController: CreateTeamController = new CreateTeamController(createTeamUseCase, tokenService);
    const inviteJoinTeamController: InviteJointTeamController = new InviteJointTeamController(inviteJoinTeamUseCase, tokenService);
    const acceptInvitationController: AcceptInvitationController = new AcceptInvitationController(acceptInvitationUseCase, tokenService);
    const leaveTeamController: DeletePlayerTeamController = new DeletePlayerTeamController(leaveTeamUseCase, tokenService);
    const getMembersByTeamController: GetMembersByTeamController = new GetMembersByTeamController(getMembersByTeamUseCase, tokenService);
    const createTournamentController: CreateTournamentController = new CreateTournamentController(createTournamentUseCase, tokenService);
    const getTournamentsController: GetTournamentsController = new GetTournamentsController(getTournamentsUseCase, tokenService);
    const cancelTournamentController: CancelTournamentController = new CancelTournamentController(cancelTournamentUseCase, tokenService);
    const registerTeamTournamentController: RegisterTeamTournamentController = new RegisterTeamTournamentController(registerTeamTournamentUseCase, tokenService);
    const getDetailsTournamentController: GetDetailsTournamentController = new GetDetailsTournamentController(getDetailsTournamentUseCase, tokenService);
    const generateMatchesController: GenerateMatchesController = new GenerateMatchesController(generateMatchesUseCase, tokenService);
    const registerMatchController: RegisterMatchResultsController = new RegisterMatchResultsController(registerMatchResultsUseCase, tokenService);
    const advancedRoundController: AdvanceRoundController = new AdvanceRoundController(advanceRoundUseCase, tokenService);
    const finalizeTournamentController: FinalizeTournamentController = new FinalizeTournamentController(finalizeTournamentUseCase, tokenService);

    return { 
        createPlayerController, resendEmailCodeController, validateCodeController, loginPlayerController, 
        getPlayersController, createTeamController, inviteJoinTeamController, acceptInvitationController,
        leaveTeamController, getMembersByTeamController, createTournamentUseCase, createTournamentController,
        getTournamentsController, cancelTournamentController, registerTeamTournamentController,
        getDetailsTournamentController, generateMatchesController, registerMatchController,
        advancedRoundController, finalizeTournamentController
    };
};
