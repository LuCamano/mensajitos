import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss'],
  standalone: false
})
export class ContactosComponent  implements OnInit {
  contactos = [
    {
      email: 'ElCid@example.com',
      uid: '122',
      nombre : 'Cid'
    },
    {
      email: 'paul@example.com',
      uid: '123',
      nombre : 'Paul'
    },
    {
      email: 'c@example.com',
      uid: '12345523541',
      nombre : 'seba'
    }   
  ]
  open_new_contact = false;

  @ViewChild('new_contact', { static: true }) modal!: IonModal;

  newEmail = '';
  
  constructor(private toastCtrl: ToastController ) { }

  ngOnInit() {}
  
  toggleModal() {
    this.open_new_contact = !this.open_new_contact;
    this.newEmail = '';
  }
  
  // Funcion para validar el correo
  isEmailValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'danger',
      position: 'bottom',
    });
    toast.present();
  }

  async addContact() {
    // Valida el correo
    if (!this.isEmailValid(this.newEmail)) {
      this.showToast('Ingrese un correo electrónico válido.');
      return;
    }

    //agrega el contacto
    this.contactos.push({ email: this.newEmail, uid: '', nombre: 'usuarioXD' });

    // Limpiar
    this.newEmail = '';
    
    // Cierra el modal
    this.toggleModal();
  }


  cancel() {
    this.modal.dismiss();
  }

  onWillDismiss(event: Event) {
    this.open_new_contact = false;
    this.newEmail = '';
  }

}
