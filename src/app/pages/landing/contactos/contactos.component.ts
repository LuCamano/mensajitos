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
      nombre : 'Cid',
      bloqueado: false
    },
    {
      email: 'paul@example.com',
      uid: '123',
      nombre : 'Paul',
      bloqueado: false
    },
    {
      email: 'c@example.com',
      uid: '12345523541',
      nombre : 'seba',
      bloqueado: false
    }   
  ]
  open_new_contact = false;
  open_contact_options = false;
  selectedContact: any = null;

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
    this.contactos.push({ email: this.newEmail, uid: '', nombre: 'usuarioXD', bloqueado: false });

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

  openContactOptions(contacto: any, event: Event) {
  event.stopPropagation(); // Evita que se dispare el click del ion-item
  this.selectedContact = contacto;
  this.open_contact_options = true;
}

  closeContactOptions() {
  this.open_contact_options = false;
  this.selectedContact = null;
}

  blockContact(contacto: any) {
  contacto.bloqueado = true;
  this.showToast(`Contacto ${contacto.nombre} bloqueado.`);
  this.closeContactOptions();
}
}
