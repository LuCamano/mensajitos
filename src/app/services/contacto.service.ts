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
  
  getContactos(userId: string){
    const cont = this.fire.getCollection(`users/${userId}/contactos`) as Promise<Contacto[]>;
    console.log('Contactos obtenidos:', cont);
    return cont;
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
