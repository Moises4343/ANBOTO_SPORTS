import { Chat } from '../domain/entities/chat';
import { Message } from '../domain/entities/message';
import { ChatRepository } from '../domain/ports/chatRepository';

export class ChatUseCases {
  constructor(private chatRepository: ChatRepository) {}
  
  async startChat(participants: string[]): Promise<string> {
    return this.chatRepository.createChat(participants);
  }
  
  async sendMessage(chatId: string, senderId: string, content: string): Promise<string> {
    const message: Message = {
      chatId,
      senderId,
      content,
      timestamp: new Date()
    };
    return this.chatRepository.sendMessage(message);
  }
  
  async listMessages(chatId: string): Promise<Message[]> {
    return this.chatRepository.getMessagesByChatId(chatId);
  }

  async getChatById(chatId: string): Promise<Chat | null> {
    return this.chatRepository.getChatById(chatId);
  }
}
