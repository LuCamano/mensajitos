import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { getDoc, setDoc, doc, addDoc, collection, collectionData, query, where } from "@angular/fire/firestore";
import { User } from '../models/usuario.models';
import { UtilsService } from './utils.service';
import { ICollectionOptions } from '../interfaces/varios';

@Injectable({
  providedIn: 'root'
})
export class FireService {
  // NO MODIFICAR ESTE ARCHIVO, ES UN SERVICIO QUE SE UTILIZA EN TODA LA APLICACION
  // Y SE ENCARGA DE LA COMUNICACION CON FIREBASE
  // CUALQUIER MODIFICACION SERÁ CASTIGADA CON LA MUERTE

  // Inyeccion de dependencias
  private ngFireAuth = inject(AngularFireAuth);
  private ngFirestore = inject(AngularFirestore);
  private utils = inject(UtilsService);

  async signUp(email: string, password: string, name: string){
    const userCredential = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
    const user: User = {
      uid: userCredential.user!.uid,
      email: email,
      displayName: name
    };
    this.setDocument(`users/${user.uid}`, user);
    return user;
  }

  // Metodo para iniciar sesion
  async signIn(email: string, password: string){
    const userCredential = await this.ngFireAuth.signInWithEmailAndPassword(email, password);
    const user = await this.getDocument(`users/${userCredential.user!.uid}`) as User;
    this.utils.saveInLocalStorage('user', user);
    return user;
  }

  // Método para obtener colecciones de Firestore con o sin filtros
  async getCollection(path: string, opts?: ICollectionOptions[]){
    let q = query(collection(this.ngFirestore.firestore, path));
    if (opts && opts.length > 0) {
      opts.forEach(opt => {
        q = query(q, where(opt.field, opt.opStr, opt.value));
      });
    }
    return collectionData(q, { idField: 'id' });
  }

  resetPassword(email: string){
    return this.ngFireAuth.sendPasswordResetEmail(email);
  }

  // Setea un documento en la ruta especificada (esta ruta debe contener la clave primaria del documento ya que no se genera automaticamente)
  // Si el documento no existe, lo crea. Si existe, lo actualiza.
  setDocument(path:string, data:any) {
    return setDoc(doc(this.ngFirestore.firestore, path), data);
  }

  // Crea un documento en la ruta especificada (esta ruta no debe contener la clave primaria del documento ya que se genera automaticamente)
  addDocument(path: string, data: any){
    return addDoc(collection(this.ngFirestore.firestore, path), data);
  }

  async getDocument(path: string){
    return (await getDoc(doc(this.ngFirestore.firestore, path))).data();
  }
}
