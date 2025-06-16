import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Chat } from 'src/app/models/chat.models';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  standalone: false
})
export class ChatsComponent implements OnInit {
  chats: Chat[] = [];
  selectedChat: Chat | null = null;

  // Mock de mensajes para maquetado
  mockMessages: { text: string; sent: boolean }[] = [
    { text: '¡Hola!', sent: false },
    { text: 'Hola, ¿cómo estás?', sent: true }
  ];
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.chats$.subscribe(chats => this.chats = chats);
  }

  openChat(chat: Chat) {
    this.selectedChat = chat;
    // Opcional: limpiar mensajes o cargar mensajes reales aquí
  }

  closeChat() {
    this.selectedChat = null;
    this.newMessage = '';
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.mockMessages.push({ text: this.newMessage, sent: true });
      this.newMessage = '';
    }
  }
}
