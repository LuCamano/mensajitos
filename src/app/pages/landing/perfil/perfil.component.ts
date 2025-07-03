import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { IonModalCustomEvent,OverlayEventDetail } from '@ionic/core';
import { User } from 'src/app/models/usuario.models';
import { FireService } from 'src/app/services/fire.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: false
})
export class PerfilComponent implements OnInit {
  // Inyecciones
  private fireSvc = inject(FireService);
  private utils = inject(UtilsService);

  @ViewChild(IonModal) 
  modal!: IonModal;

  editForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  currentUser!: User;
  
  ngOnInit() {
    this.getUserData();
  }

  confirm() {
    this.modal.dismiss(null, 'confirm')
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirmEdit(event: IonModalCustomEvent<OverlayEventDetail<any>>) {
    if (event.detail.role === 'confirm' && this.editForm.valid) {
      this.updateProfile();
    }
  }

  getUserData() {
    this.currentUser = this.utils.getFromLocalStorage('user');
    this.editForm.patchValue({
      username: this.currentUser.displayName,
      email: this.currentUser.email
    });
  }

  async updateProfile() {
    const updatedUser: User = {...this.currentUser}
    updatedUser.displayName = this.editForm.value.username || this.currentUser.displayName;
    const loading = await this.utils.presentLoading();
    try {
      await this.fireSvc.setDocument(`users/${this.currentUser.uid}`, updatedUser);
      this.utils.saveInLocalStorage('user', updatedUser);
      this.utils.presentToast({
        message: 'Perfil actualizado correctamente',
        duration: 2000,
        color: 'success'
      });
      this.getUserData();
    } catch (error) {
      this.utils.presentToast({
        message: 'Error al actualizar el perfil',
        duration: 2000,
        color: 'danger'
      });
    } finally {
      loading.dismiss();
    }
  }
}
