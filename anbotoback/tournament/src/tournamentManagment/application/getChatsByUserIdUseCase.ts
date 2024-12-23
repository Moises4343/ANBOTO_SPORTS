import { Chat } from "../domain/entities/chat";
import { ChatRepository } from '../domain/ports/chatRepository';

export class GetChatsByUserIdUseCase {
  constructor(private chatRepository: ChatRepository) {}

  async execute(userId: string): Promise<Chat[]> {
    return await this.chatRepository.getChatsByUserId(userId);
  }
}
