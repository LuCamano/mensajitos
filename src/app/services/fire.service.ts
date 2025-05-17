import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { doc, setDoc, getDoc } from "@angular/fire/firestore";
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FireService {
  private auth = inject(AngularFireAuth);
  private firestore = inject(AngularFirestore);
  private utils = inject(UtilsService);

  // ==== REGISTRO CON NOMBRE, EMAIL Y CONTRASEÑA ==== //
  async signUp(name: string, email: string, password: string) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      
      // Guardar datos extendidos en Firestore
      await setDoc(
        doc(this.firestore.firestore, `users/${userCredential.user?.uid}`),
        { 
          uid: userCredential.user?.uid,
          name: name,
          email: email,
          createdAt: new Date().toISOString() 
        }
      );

      return { 
        uid: userCredential.user?.uid,
        name: name,
        email: email 
      };

    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==== INICIO DE SESIÓN ==== //
  async signIn(email: string, password: string) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const userData = await this.getUserData(userCredential.user?.uid!);
      
      // Guardar en localStorage (opcional)
      this.utils.saveInLocalStorage('user', userData);
      
      return userData;

    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==== OBTENER DATOS DEL USUARIO (Firestore) ==== //
  private async getUserData(uid: string) {
    const docSnap = await getDoc(doc(this.firestore.firestore, `users/${uid}`));
    return docSnap.exists() ? docSnap.data() : null;
  }

  // ==== MANEJO DE ERRORES ==== //
  private handleError(error: any): Error {
    const errors: Record<string, string> = {
      'auth/email-already-in-use': 'El correo ya está registrado',
      'auth/invalid-email': 'Correo no válido',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta'
    };
    return new Error(errors[error.code] || 'Error desconocido');
  }
}