import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FireService } from '../../../services/fire.service';
import { UtilsService } from '../../../services/utils.service';
import { User } from '../../../models/usuario.models';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: false
})
export class PerfilComponent implements OnInit {

  user: string = '';
  email: string = '';
  currentUser: User | null = null;
  isEditMode: boolean = false;
  editForm: FormGroup;

  private fireService = inject(FireService);
  private utils = inject(UtilsService);
  private formBuilder = inject(FormBuilder);

  constructor() {
    this.editForm = this.formBuilder.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = this.currentUser?.displayName || 'Usuario';
    this.email = this.currentUser?.email || '';
    
    // Initialize form with current user data
    this.editForm.patchValue({
      displayName: this.user
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.editForm.patchValue({
        displayName: this.user
      });
    }
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editForm.patchValue({
      displayName: this.user
    });
  }

  async saveProfile() {
    if (this.editForm.valid && this.currentUser) {
      const loading = await this.utils.presentLoading();
      
      try {
        const newDisplayName = this.editForm.value.displayName.trim();
        
        // Update user object
        const updatedUser: User = {
          ...this.currentUser,
          displayName: newDisplayName
        };

        // Update in Firebase
        await this.fireService.setDocument(`users/${this.currentUser.uid}`, updatedUser);
        
        // Update localStorage
        this.utils.saveInLocalStorage('user', updatedUser);
        
        // Update component state
        this.user = newDisplayName;
        this.currentUser = updatedUser;
        this.isEditMode = false;

        await this.utils.presentToast({
          message: 'Perfil actualizado correctamente',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });

      } catch (error) {
        console.error('Error updating profile:', error);
        await this.utils.presentToast({
          message: 'Error al actualizar el perfil. Inténtalo de nuevo.',
          duration: 3000,
          position: 'bottom',
          color: 'danger'
        });
      } finally {
        loading.dismiss();
      }
    }
  }
}
