import express, { Application } from "express";
import morgan from "morgan";
import { initializeDependencies } from "./tournamentManagment/infrastructure/dependencies";
import { playerRouter } from "./tournamentManagment/infrastructure/routes/playerRoutes";
import { connectToDatabase } from "./tournamentManagment/infrastructure/database/database";
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
            dependencies.leaveTeamController
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
