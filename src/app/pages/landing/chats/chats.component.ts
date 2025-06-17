import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Chat } from 'src/app/models/chat.models';
import { Contacto } from 'src/app/models/contacto.models';
import { Mensaje } from 'src/app/models/mensaje.model';
import { User } from '../../../models/usuario.models';
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  standalone: false
})
export class ChatsComponent implements OnInit, OnDestroy {
  chats: Chat[] = [];
  selectedChat: Chat | null = null;
  nuevoMensaje: string = '';
  chatId: string = '';
  mensajes: Mensaje[] = [];
  newMessage: string = '';
  currentUserId = getAuth().currentUser?.uid || '';

  user: User = JSON.parse(localStorage.getItem('user')!);

  private mensajesUnsubscribe?: () => void;
  
  constructor(private chatService: ChatService) {}
  // Mock de mensajes para maquetado
  mockMessages: { text: string; sent: boolean }[] = [
    { text: '¡Hola!', sent: false },
    { text: 'Hola, ¿cómo estás?', sent: true },
    { text: 'Estoy bien, gracias.', sent: false },
    { text: '¿Y tú?', sent: true },
    { text: 'Todo bien, gracias por preguntar.', sent: false }
  ];
  


  async ngOnInit() {
    this.chatService.chats$.subscribe(chats => this.chats = chats);
    // Obtener o crear el chatId
    this.chatId = await this.chatService.getChatId(this.contacto?.uid!);

    // Escuchar mensajes en tiempo real
    this.mensajesUnsubscribe = this.chatService.escucharMensajes(this.chatId, mensajes => {
      this.mensajes = mensajes;
    });
  }


  @Input() contacto?: Contacto;

  async openChat(chat: Chat) {
  this.selectedChat = chat;
  this.chatId = await this.chatService.getChatId(chat.contacto.uid!);

  this.chatService.escucharMensajes(this.chatId, (mensajes: Mensaje[]) => {
    this.mensajes = mensajes;
  });
}

  closeChat() {
    this.selectedChat = null;
    this.newMessage = '';
  }


  async sendMessage() {
    if (this.newMessage.trim()) {
      await this.chatService.enviarMensaje(this.chatId, this.newMessage.trim());
      this.newMessage = '';
    }
  }

  ngOnDestroy() {
    // Dejar de escuchar mensajes cuando el componente se destruya
    if (this.mensajesUnsubscribe) this.mensajesUnsubscribe();
  }

  async enviarMensaje() {
    if (this.nuevoMensaje.trim().length === 0) return;

    await this.chatService.enviarMensaje(this.chatId, this.nuevoMensaje.trim());
    this.nuevoMensaje = '';
  }

}
