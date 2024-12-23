import { Router } from "express";
import { AcceptInvitationController } from "../controllers/acceptInvitationController";
import { CreatePlayerController } from "../controllers/createPlayerController";
import { DeletePlayerTeamController } from "../controllers/deletePlayerTeamController";
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
        getPlayerByUUIDController: GetPlayerByUUIDController
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

        return router;
};