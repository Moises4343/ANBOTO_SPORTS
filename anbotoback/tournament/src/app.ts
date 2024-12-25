import express, { Application } from "express";
import morgan from "morgan";
import path from "path";
import { connectToDatabase } from "./tournamentManagment/infrastructure/database/database";
import { initializeDependencies } from "./tournamentManagment/infrastructure/dependencies";
import { chatRouter } from "./tournamentManagment/infrastructure/routes/chatRoutes";
import { playerRouter } from "./tournamentManagment/infrastructure/routes/playerRoutes";
import { postRouter } from "./tournamentManagment/infrastructure/routes/postRoutes";
import { teamRouter } from "./tournamentManagment/infrastructure/routes/teamRoutes";
import { tournamentRouter } from "./tournamentManagment/infrastructure/routes/tournamentRoutes";


(async () => {
    try {
        await connectToDatabase();
        const dependencies = await initializeDependencies();

        const app: Application = express();
        app.use(express.json());
        app.use(morgan('dev'));

        app.use('/players', playerRouter(
            dependencies.createPlayerController, dependencies.resendEmailCodeController, 
            dependencies.validateCodeController, dependencies.loginPlayerController,
            dependencies.getPlayersController, dependencies.acceptInvitationController,
            dependencies.leaveTeamController, dependencies.getPlayerByUUIDController,
            dependencies.getAllPlayersController, dependencies.deletePlayerController
        ));

        app.use('/teams', teamRouter(
            dependencies.createTeamController, dependencies.inviteJoinTeamController,
            dependencies.getMembersByTeamController
        ));

        app.use('/tournaments', tournamentRouter(
            dependencies.createTournamentController, dependencies.getTournamentsController,
            dependencies.cancelTournamentController, dependencies.registerTeamTournamentController,
            dependencies.getDetailsTournamentController, dependencies.generateMatchesController,
            dependencies.registerMatchController, dependencies.advancedRoundController,
            dependencies.finalizeTournamentController
        ));
        
        app.use('/chats', chatRouter(dependencies.chatController));

        app.use("/posts", postRouter(dependencies.postController));
        app.use('/images', express.static(path.join(__dirname, 'tournamentManagment/infrastructure/images')));

        process.loadEnvFile();
        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`SERVER RUNNING IN http://localhost:${PORT}`);
        });

        process.on("SIGINT", async () => {
            console.log("CLOSING CONNECTIONS...");
            process.exit(0);
        });
    } catch (error) {
        console.error("ERROR START APP:", error);
    }
})();
