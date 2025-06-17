import { Contacto } from './contacto.models';

export interface Chat {
  id?: string; 
  contacto: Contacto;
  lastMessage?: string;
  timestamp?: number
}