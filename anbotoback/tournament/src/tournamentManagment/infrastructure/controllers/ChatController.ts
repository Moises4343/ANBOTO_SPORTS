import { Request, Response } from 'express';
import { ChatUseCases } from '../../application/chatUseCases';
import { DeleteChatUseCase } from '../../application/deleteChatUseCase';
import { GetChatsByUserIdUseCase } from "../../application/getChatsByUserIdUseCase";
import { TokenService } from '../../application/tokenService';
import { CustomError } from '../error/error';

export class ChatController {
  constructor(
    private chatUseCases: ChatUseCases,
    private getChatsByUserIdUseCase: GetChatsByUserIdUseCase, 
    private deleteChatUseCase: DeleteChatUseCase,
    private tokenService: TokenService
  ) {}

  async startChat(req: Request, res: Response) {
    try {
      const userId = this.getUserIdFromToken(req); 
      const { participants } = req.body;

      if (!participants.includes(userId)) {
        participants.push(userId);
      }

      const chatId = await this.chatUseCases.startChat(participants);

      res.status(201).json({ chatId });
    } catch (error: any) {
      console.error("Error inesperado en startChat:", error);
      res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const userId = this.getUserIdFromToken(req);
      const { chatId } = req.params;
      const { content } = req.body;


      const messageId = await this.chatUseCases.sendMessage(chatId, userId, content);

      res.status(201).json({ messageId });
    } catch (error: any) {
      console.error("Error inesperado en sendMessage:", error);
      res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
    }
  }

  async listMessages(req: Request, res: Response) {
    try {
      const userId = this.getUserIdFromToken(req);
      const { chatId } = req.params;
    
      const chat = await this.chatUseCases.getChatById(chatId);
      if (!chat || !chat.participants.includes(userId)) {
        throw new CustomError(403, "No tienes permisos para ver este chat.");
      }
  
      const messages = await this.chatUseCases.listMessages(chatId);
  
      res.status(200).json(messages);
    } catch (error: any) {
      console.error("Error inesperado en listMessages:", error);
      res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
    }
  }
  
  async getChatsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserIdFromToken(req);

      const chats = await this.getChatsByUserIdUseCase.execute(userId);

      res.status(200).json(chats);
    } catch (error: any) {
      console.error("Error al obtener los chats del usuario:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  private getUserIdFromToken(req: Request): string {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError(401, "Token no proporcionado o formato incorrecto.");
    }
    
    const token = authHeader.split(" ")[1];
    if (!this.tokenService.validateToken(token)) {
      throw new CustomError(401, "El token no es válido.");
    }
    
    const payload = this.tokenService.getTokenData<{ uuid: string }>(token);
    if (!payload.uuid) {
      throw new CustomError(401, "El token no contiene el UUID.");
    }

    return payload.uuid;
  }
  
  async deleteChat(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError(401, "Token no proporcionado o inválido.");
      }

      const token = authHeader.split(" ")[1];
      const { uuid } = this.tokenService.getTokenData<{ uuid: string }>(token);

      const { chatId } = req.params;
      if (!chatId) {
        throw new CustomError(400, "El ID del chat es obligatorio.");
      }

      await this.deleteChatUseCase.execute(chatId, uuid);

      res.status(200).json({ message: "Chat eliminado correctamente." });
    } catch (error: any) {
      console.error("Error al eliminar el chat:", error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

}
