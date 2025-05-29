import { Injectable, inject } from '@angular/core';
import { Contacto } from '../models/contacto.models';
import { FireService } from './fire.service';
import { Observable } from 'rxjs';
import { collection, collectionData } from '@angular/fire/firestore';
import { AngularFirestore } from "@angular/fire/compat/firestore";


@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  
  private fire = inject(FireService);
  private firestore = inject(AngularFirestore);

  // ver contactos 
  getContactos(userId: string): Observable<Contacto[]> {
    const ref = collection(this.firestore.firestore, `users/${userId}/contactos`);
    return collectionData(ref, { idField: 'id' }) as Observable<Contacto[]>;
  }

  // Agregar contacto 
  addContact(userId: string, email: string){
    return this.fire.addDocument(`users/${userId}/contactos`, email);
  }
  
}
