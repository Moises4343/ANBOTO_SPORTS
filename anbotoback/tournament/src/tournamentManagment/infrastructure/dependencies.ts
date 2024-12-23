import { AcceptInvitationUseCase } from "../application/accepteInvitationUseCase";
import { AdvanceRoundUseCase } from "../application/advancedRoundUseCase";
import { CancelTournamentUseCase } from "../application/cancelTournamentUseCase";
import { ChatUseCases } from "../application/chatUseCases";
import { CreatePlayerUseCase } from "../application/createPlayerUseCase";
import { CreatePostUseCase } from "../application/createPostUseCase";
import { CreateTeamUseCase } from "../application/createTeamUseCase";
import { CreateTournamentUseCase } from "../application/createTournamentUseCase";
import { DeletePlayerTeamUseCase } from "../application/deletePlayerTeamUseCase";
import { DeletePostUseCase } from "../application/deletePostUseCase";
import { FinalizeTournamentUseCase } from "../application/finalizeTournamentUseCase";
import { GenerateMatchesUseCase } from "../application/generedMatchesUseCase";
import { GetAllPostsUseCase } from "../application/getAllPostsUseCase";
import { GetChatsByUserIdUseCase } from "../application/getChatsByUserIdUseCase";
import { GetDetailsTournamentUseCase } from "../application/getDetailsTournamentUseCase";
import { GetMembersByTeamUseCase } from "../application/getMemberByTeamUseCase";
import { GetPlayerByUUIDUseCase } from "../application/getPlayerByUUIDUseCase";
import { GetPlayersUseCase } from "../application/getPlayersUseCase";
import { GetTournamentsUseCase } from "../application/getTournamentsUseCase";
import { GetUserPostsUseCase } from "../application/getUserPostsUseCase";
import { InviteJoinTeamUseCase } from "../application/inviteJoinTeamUseCase";
import { LoginPlayerUseCase } from "../application/loginPlayerUseCase";
import { RegisterMatchResultsUseCase } from "../application/registerMatchUseCase";
import { RegisterTeamTournamentUseCase } from "../application/registerTeamTournamentUseCase";
import { ResendEmailCodeUseCase } from "../application/resendEmailCodeUseCase";
import { SenderService } from "../application/senderService";
import { TokenService } from "../application/tokenService";
import { ValidateCodeUseCase } from "../application/validateCodeUseCase";
import { PlayerRepository } from "../domain/ports/playerRepository";
import { TeamRepository } from "../domain/ports/teamRepository";
import { TournamentRepository } from "../domain/ports/tournamentRepository";
import { AcceptInvitationController } from "./controllers/acceptInvitationController";
import { AdvanceRoundController } from "./controllers/advancedRoundController";
import { CancelTournamentController } from "./controllers/cancelTournamentController";
import { ChatController } from "./controllers/ChatController";
import { CreatePlayerController } from "./controllers/createPlayerController";
import { CreateTeamController } from "./controllers/createTeamController";
import { CreateTournamentController } from "./controllers/createTournamentController";
import { DeletePlayerTeamController } from "./controllers/deletePlayerTeamController";
import { FinalizeTournamentController } from "./controllers/finalizeTournamentController";
import { GenerateMatchesController } from "./controllers/generatedMatchesController";
import { GetDetailsTournamentController } from "./controllers/getDetailsTournamentController";
import { GetMembersByTeamController } from "./controllers/getMembersByTeamController";
import { GetPlayerByUUIDController } from "./controllers/getPlayerByUUIDController";
import { GetPlayersController } from "./controllers/getPlayersController";
import { GetTournamentsController } from "./controllers/getTournamentsController";
import { InviteJointTeamController } from "./controllers/inviteJoinTeamController";
import { LoginPlayerController } from "./controllers/loginPlayerController";
import { PostController } from "./controllers/PostController";
import { RegisterMatchResultsController } from "./controllers/registerMatchController";
import { RegisterTeamTournamentController } from "./controllers/registerTeamTournamentController";
import { ResendEmailCodeController } from "./controllers/resendEmailCodeController";
import { ValidateCodeController } from "./controllers/validateCodeController";
import { connectRabbit } from "./rabbitmq/rabbit";
import { RabbitMQService } from "./rabbitmq/senderService";
import { FirestoreChatRepository } from "./repositories/firestoreChatRepository";
import { PlayerRepositoryImpl } from "./repositories/playerRepositoryImpl";
import { PostRepositoryImpl } from "./repositories/PostRepositoryImpl";
import { TeamRepositoryImpl } from "./repositories/teamRepositoryImpl";
import { TournamentRepositoryImpl } from "./repositories/tournamentRepositoryImpl";
import { JWTTokenService } from "./token/JWTTokenService";


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

    const chatRepository = new FirestoreChatRepository();
    const chatUseCases = new ChatUseCases(chatRepository);
    const getChatsByUserIdUseCase = new GetChatsByUserIdUseCase(chatRepository);
    const chatController = new ChatController(chatUseCases, getChatsByUserIdUseCase, tokenService);
    

    const getPlayerByUUIDUseCase = new GetPlayerByUUIDUseCase(playerRepository);
    const getPlayerByUUIDController = new GetPlayerByUUIDController(getPlayerByUUIDUseCase);

    const postRepository = new PostRepositoryImpl();
    const createPostUseCase = new CreatePostUseCase(postRepository);
    const getAllPostsUseCase = new GetAllPostsUseCase(postRepository);
    const getUserPostsUseCase = new GetUserPostsUseCase(postRepository);
    const deletePostUseCase = new DeletePostUseCase(postRepository);

    const postController = new PostController(createPostUseCase, getAllPostsUseCase, getUserPostsUseCase, deletePostUseCase, tokenService);

    return { 
        createPlayerController, resendEmailCodeController, validateCodeController, loginPlayerController, 
        getPlayersController, createTeamController, inviteJoinTeamController, acceptInvitationController,
        leaveTeamController, getMembersByTeamController, createTournamentUseCase, createTournamentController,
        getTournamentsController, cancelTournamentController, registerTeamTournamentController,
        getDetailsTournamentController, generateMatchesController, registerMatchController,
        advancedRoundController, finalizeTournamentController,
        chatController, getPlayerByUUIDController,
        postController
    };
};
