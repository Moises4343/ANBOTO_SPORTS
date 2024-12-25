import { ChatRepository } from "../domain/ports/chatRepository";
import { CustomError } from "../infrastructure/error/error";

export class DeleteChatUseCase {
  constructor(private repository: ChatRepository) {}

  async execute(chatId: string, userId: string): Promise<void> {
    const chat = await this.repository.getChatById(chatId);

    if (!chat) {
      throw new CustomError(404, "El chat no existe.");
    }

    if (!chat.participants.includes(userId)) {
      throw new CustomError(403, "No tienes permiso para eliminar este chat.");
    }

    await this.repository.deleteChatById(chatId, userId);
  }
}
