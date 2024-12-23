import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';

export const chatRouter = (
  chatController: ChatController
): Router => {
  const router = Router();

  
  router.post('/create-chat', chatController.startChat.bind(chatController));
  router.post('/send-message/:chatId/messages', chatController.sendMessage.bind(chatController));
  router.get('/receive-message/:chatId/messages', chatController.listMessages.bind(chatController));
  router.get("/list-chats", chatController.getChatsByUserId.bind(chatController));

  return router;
};
