import { Chat } from '../../domain/entities/chat';
import { Message } from '../../domain/entities/message';
import { ChatRepository } from '../../domain/ports/chatRepository';
import { firestore } from '../providers/firebase';

export class FirestoreChatRepository implements ChatRepository {
  private chatsCollection = firestore.collection('chats');

  async createChat(participants: string[]): Promise<string> {
    const docRef = await this.chatsCollection.add({
      participants,
      createdAt: new Date()
    });
    return docRef.id;
  }

  async getChatById(chatId: string): Promise<Chat | null> {
    const doc = await this.chatsCollection.doc(chatId).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return { id: doc.id, ...data } as Chat;
  }

  async sendMessage(message: Message): Promise<string> {
    const messagesCollection = this.chatsCollection.doc(message.chatId).collection('messages');
    const docRef = await messagesCollection.add({
      senderId: message.senderId,
      content: message.content,
      timestamp: message.timestamp
    });
    return docRef.id;
  }

  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    const messagesCollection = this.chatsCollection.doc(chatId).collection('messages');
    const snapshot = await messagesCollection.orderBy('timestamp', 'asc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, chatId, ...doc.data() } as Message));
  }


  async getChatsByUserId(userId: string): Promise<Chat[]> {
  
    const chatsSnapshot = await firestore.collection("chats")
      .where("participants", "array-contains", userId)
      .get(); 
  
    return chatsSnapshot.docs.map(doc => ({
      id: doc.id,
      participants: doc.data().participants,
      createdAt: doc.data().createdAt.toDate()
    }));
  }
  
  async deleteChatById(chatId: string, userId: string): Promise<void> {
    const chatDoc = this.chatsCollection.doc(chatId);
    const chatSnapshot = await chatDoc.get();

    if (!chatSnapshot.exists) {
      throw new Error("El chat no existe.");
    }

    const chatData = chatSnapshot.data();

    if (!chatData?.participants.includes(userId)) {
      throw new Error("No tienes permiso para eliminar este chat.");
    }

    await chatDoc.delete();
  }
  
  
}
