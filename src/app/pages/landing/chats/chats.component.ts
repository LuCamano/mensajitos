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

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.chats$.subscribe(chats => this.chats = chats);
  }

  openChat(chat: Chat) {
    this.selectedChat = chat;
  }

  closeChat() {
    this.selectedChat = null;
  }
}
