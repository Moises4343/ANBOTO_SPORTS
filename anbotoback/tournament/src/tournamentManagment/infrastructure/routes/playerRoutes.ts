import { Router } from "express";
import { AcceptInvitationController } from "../controllers/acceptInvitationController";
import { CleanPlayersTeamUUIDController } from "../controllers/cleanPlayersTeamUUIDController";
import { CreatePlayerController } from "../controllers/createPlayerController";
import { DeletePlayerController } from "../controllers/deletePlayerController";
import { DeletePlayerTeamController } from "../controllers/deletePlayerTeamController";
import { GetAllPlayersController } from "../controllers/getAllPlayersController";
import { GetPlayerByUUIDController } from "../controllers/getPlayerByUUIDController";
import { GetPlayersController } from "../controllers/getPlayersController";
import { LoginPlayerController } from "../controllers/loginPlayerController";
import { ResendEmailCodeController } from "../controllers/resendEmailCodeController";
import { ValidateCodeController } from "../controllers/validateCodeController";


export const playerRouter = (
        createPlayerController: CreatePlayerController, 
        resendEmailCodeController: ResendEmailCodeController,
        validateCodeController: ValidateCodeController,
        loginPlayerController: LoginPlayerController,
        getPlayersController: GetPlayersController,
        acceptInvitationController: AcceptInvitationController,
        leaveTeamController: DeletePlayerTeamController,
        getPlayerByUUIDController: GetPlayerByUUIDController,
        getAllPlayersController: GetAllPlayersController,
        deletePlayerController: DeletePlayerController,
        cleanPlayersTeamUUIDController: CleanPlayersTeamUUIDController

    ): Router => {
        const router = Router();

        router.post('/create', createPlayerController.execute.bind(createPlayerController));
        router.post('/resend-email-code', resendEmailCodeController.execute.bind(resendEmailCodeController));
        router.post('/validate-code', validateCodeController.execute.bind(validateCodeController));
        router.post('/login', loginPlayerController.execute.bind(loginPlayerController));
        router.get('/search/:search', getPlayersController.execute.bind(getPlayersController));
        router.post('/accept-invitation', acceptInvitationController.execute.bind(acceptInvitationController));
        router.delete('/leave/:teamUUID', leaveTeamController.execute.bind(leaveTeamController));
        router.get("/uuid/:uuid", getPlayerByUUIDController.execute.bind(getPlayerByUUIDController));
        router.get("/all-players", getAllPlayersController.execute.bind(getAllPlayersController));
        router.delete("/delete/:playerUuid", deletePlayerController.execute.bind(deletePlayerController));

        router.post('/clean-team-uuids', cleanPlayersTeamUUIDController.execute.bind(cleanPlayersTeamUUIDController));

         
        return router;
};