import { Injectable, inject } from '@angular/core';
import { Contacto } from '../models/contacto.models';
import { FireService } from './fire.service';
import { Observable } from 'rxjs';
import { User } from '../models/usuario.models';


@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  
  private fire = inject(FireService);
  
  async getContactos(userId: string){
    const cont = await this.fire.getCollection(`users/${userId}/contactos`);
    return cont as Observable<Contacto[]>;
  }

  // Eliminar contacto
  deleteContact(userId: string, id: string){
    return this.fire.setDocument(`users/${userId}/contactos/${id}`, null);
  }

  // Agregar contacto 
  addContact(userId: string, user: User){
    return this.fire.addDocument(`users/${userId}/contactos`, user);
  }
  
}
