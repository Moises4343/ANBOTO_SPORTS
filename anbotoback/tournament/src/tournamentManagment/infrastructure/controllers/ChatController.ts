import { Request, Response } from 'express';
import { ChatUseCases } from '../../application/chatUseCases';
import { GetChatsByUserIdUseCase } from "../../application/getChatsByUserIdUseCase";
import { TokenService } from '../../application/tokenService';
import { CustomError } from '../error/error';

export class ChatController {
  constructor(
    private chatUseCases: ChatUseCases,
    private getChatsByUserIdUseCase: GetChatsByUserIdUseCase, 
    private tokenService: TokenService
  ) {}

  async startChat(req: Request, res: Response) {
    try {
      const userId = this.getUserIdFromToken(req); 
      const { participants } = req.body;

      console.log("ID del usuario desde el token:", userId);
      console.log("Participantes recibidos:", participants);

      if (!participants.includes(userId)) {
        participants.push(userId);
      }

      const chatId = await this.chatUseCases.startChat(participants);
      console.log("Chat creado con ID:", chatId);

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

      console.log("Enviando mensaje. Usuario:", userId, "ChatID:", chatId, "Contenido:", content);

      const messageId = await this.chatUseCases.sendMessage(chatId, userId, content);
      console.log("Mensaje enviado con ID:", messageId);

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
  
      console.log("Validando acceso para el usuario:", userId, "en el chat:", chatId);
  
      const chat = await this.chatUseCases.getChatById(chatId);
      if (!chat || !chat.participants.includes(userId)) {
        throw new CustomError(403, "No tienes permisos para ver este chat.");
      }
  
      const messages = await this.chatUseCases.listMessages(chatId);
      console.log("Mensajes obtenidos:", messages.length);
  
      res.status(200).json(messages);
    } catch (error: any) {
      console.error("Error inesperado en listMessages:", error);
      res.status(error.statusCode || 500).json({ error: error.message || "Error interno del servidor" });
    }
  }
  
  async getChatsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.getUserIdFromToken(req);
      console.log("Obteniendo chats para el usuario con UUID:", userId);

      const chats = await this.getChatsByUserIdUseCase.execute(userId);
      console.log("Cantidad de chats encontrados:", chats.length);

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

    console.log("UUID extraído del token:", payload.uuid);
    return payload.uuid;
  }
}
