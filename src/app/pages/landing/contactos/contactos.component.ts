import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Contacto } from 'src/app/models/contacto.models';
import { ContactoService } from 'src/app/services/contacto.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FireService } from '../../../services/fire.service';
import { User } from 'src/app/models/usuario.models';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss'],
  standalone: false
})
export class ContactosComponent  implements OnInit {
  private contactoSvc = inject(ContactoService);
  private utils = inject(UtilsService);
  private fire = inject(FireService);

  contactos: Contacto[] = [];
  open_new_contact = false;
  newEmail = '';
  userId = this.utils.getFromLocalStorage('user').uid; 
  @ViewChild('new_contact', { static: true }) modal!: IonModal;

  ngOnInit() {
    this.cargarContactos();
  }

  cargarContactos() {
    this.contactoSvc.getContactos(this.userId).then( contactos => {
      contactos.sort((a, b) => a.displayName.localeCompare(b.displayName));
      this.contactos = contactos;
    });
  }

  async getUser(email: string) {
    const user = (await this.fire.getCollection(`users`, [{ field: 'email', opStr: '==', value: email }])) as User[];
    return user[0];
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

  async addContact() {
    if (this.newEmail && this.isEmailValid(this.newEmail)) {
      console.log('Agregando contacto con email:', this.newEmail);
      try {
        const user = await this.getUser(this.newEmail);
        console.log('Usuario encontrado:', user);
        await this.contactoSvc.addContact(this.userId, user);
        this.utils.presentToast({
          message: 'Contacto agregado correctamente.',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        })
        this.toggleModal();
      } catch (error) {
        console.error('Error al agregar el contacto:', error);
        this.utils.presentToast({
          message: 'Error al agregar el contacto. Asegúrate de que el usuario exista.',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
      }
    } else {
      this.utils.presentToast({
        message:'Por favor, ingresa un correo electr&oacute;nico v&aacute;lido.',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
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
