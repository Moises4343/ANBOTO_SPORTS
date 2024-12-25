import { Chat } from '../entities/chat';
import { Message } from '../entities/message';

export interface ChatRepository {
  createChat(participants: string[]): Promise<string>;
  getChatById(chatId: string): Promise<Chat | null>;
  sendMessage(message: Message): Promise<string>;
  getMessagesByChatId(chatId: string): Promise<Message[]>;
  getChatsByUserId(userId: string): Promise<Chat[]>;
  deleteChatById(chatId: string, userId: string): Promise<void>;
}
