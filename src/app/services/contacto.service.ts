import { Injectable, inject } from '@angular/core';
import { Contacto } from '../models/contacto.models';
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private fire = inject(FireService);

  // Agregar contacto usando FireService
  addContact(userId: string, contacto: Contacto) {
    return this.fire.addDocument(`users/${userId}/contactos`, contacto);
  }
  // Obtener contactos 
  getContacts(userId: string) {
    return this.fire.getDocument(`users/${userId}/contactos`);
  }
}
