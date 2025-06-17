import { Injectable } from '@angular/core';
import { Chat } from '../models/chat.models';
import { BehaviorSubject } from 'rxjs';
import { Contacto } from '../models/contacto.models';
import { User } from '../models/usuario.models';
import { FireService } from './fire.service';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  onSnapshot
} from '@angular/fire/firestore';
import { Mensaje } from '../models/mensaje.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatsSubject = new BehaviorSubject<Chat[]>([]);
  chats$ = this.chatsSubject.asObservable();

  private user: User;

  constructor(private fireService: FireService) {
    this.user = JSON.parse(localStorage.getItem('user')!);
  }

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

  //  1. Obtener (o crear) ID del chat entre usuario y contacto
  async getChatId(contactoUid: string): Promise<string> {
    const participantes = [this.user.uid, contactoUid].sort();
    const q = query(
      collection(this.fireService['ngFirestore'].firestore, 'chats'),
      where('participantes', '==', participantes)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    } else {
      const docRef = await addDoc(
        collection(this.fireService['ngFirestore'].firestore, 'chats'),
        {
          participantes,
          timestamp: Date.now()
        }
      );
      return docRef.id;
    }
  }

  // 🧠 2. Escuchar los mensajes del chat
  escucharMensajes(chatId: string, callback: (mensajes: Mensaje[]) => void) {
    const mensajesRef = collection(this.fireService['ngFirestore'].firestore, 'chats', chatId, 'mensajes');
    const q = query(mensajesRef, orderBy('timestamp'));

    return onSnapshot(q, snapshot => {
      const mensajes: Mensaje[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Mensaje)
      }));
      callback(mensajes);
    });
  }

  // 🧠 3. Enviar mensaje
  async enviarMensaje(chatId: string, contenido: string) {
    const mensaje: Mensaje = {
      emisorUid: this.user.uid!,
      contenido,
      timestamp: Date.now()
    };

    return this.fireService.addDocument(`chats/${chatId}/mensajes`, mensaje);
  }
  
}