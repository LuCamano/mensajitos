import { Injectable } from '@angular/core';
import { Chat } from '../models/chat.models';
import { BehaviorSubject } from 'rxjs';
import { Contacto } from '../models/contacto.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatsSubject = new BehaviorSubject<Chat[]>([]);
  chats$ = this.chatsSubject.asObservable();

  get chats(): Chat[] {
    return this.chatsSubject.value;
  }

  openChat(contacto: Contacto) {
    const exists = this.chats.find(c => c.contacto.uid === contacto.uid);
    if (!exists) {
      const newChat: Chat = {
        id: contacto.uid!,
        contacto,
        lastMessage: '',
        timestamp: Date.now()
      };
      this.chatsSubject.next([newChat, ...this.chats]);
    }
  }

  closeChat(chatId: string) {
    this.chatsSubject.next(this.chats.filter(c => c.id !== chatId));
  }
}