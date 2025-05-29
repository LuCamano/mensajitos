import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ToastController } from '@ionic/angular';
import { Contacto } from 'src/app/models/contacto.models';
import { ContactoService } from 'src/app/services/contacto.service';


@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss'],
  standalone: false
})
export class ContactosComponent  implements OnInit {
  contactos: Contacto[] = [];
  open_new_contact = false;
  newEmail = '';
  @ViewChild('new_contact', { static: true }) modal!: IonModal;

  userId = localStorage.getItem('userId') || ''; 
  
  constructor(private toastCtrl: ToastController , private contactoService: ContactoService) { }

  ngOnInit() {
    this.cargarContactos();
  }

  cargarContactos() {
    this.contactoService.getContactos(this.userId).subscribe(contactos => {
      this.contactos = contactos;
    });
  }
  
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
    if (this.newEmail && this.isEmailValid(this.newEmail)) {
      try {
        await this.contactoService.addContact(this.userId, this.newEmail);
        this.cargarContactos();
        this.showToast('Contacto agregado correctamente.');
        this.toggleModal();
      } catch (error) {
        console.error('Error al agregar el contacto:', error);
        this.showToast('Error al agregar el contacto.');
      }
    } else {
      this.showToast('Por favor, ingresa un correo electr&oacute;nico v&aacute;lido.');
    }
  }

  cancel() {
    this.modal.dismiss();
  }

  onWillDismiss(event: Event) {
    this.open_new_contact = false;
    this.newEmail = '';
  }

}
