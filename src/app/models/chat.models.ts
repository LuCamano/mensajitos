import { Contacto } from './contacto.models';

export interface Chat {
  id?: string; // id del contacto o del chat
  contacto: Contacto;
  lastMessage?: string;
  timestamp?: number
}