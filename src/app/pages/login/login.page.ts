import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FireService } from '../../services/fire.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  rememberMe = false;

  constructor(
    private fb: FormBuilder,
    private fireService: FireService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.checkRememberedUser();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  private checkRememberedUser(): void {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      const userData = JSON.parse(rememberedUser);
      this.loginForm.patchValue({
        email: userData.email,
        rememberMe: true
      });
      this.rememberMe = true;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.loading) return;

    this.loading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...'
    });
    await loading.present();

    try {
      const { email, password, rememberMe } = this.loginForm.value;
      
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ email }));
      } else {
        localStorage.removeItem('rememberedUser');
      }

      await this.fireService.signIn(email, password);
      await loading.dismiss();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error: any) {
      await loading.dismiss();
      this.loading = false;
      this.showAlert('Error', this.getErrorMessage(error));
    }
  }

  private getErrorMessage(error: any): string {
    if (!error.code) return 'Ocurrió un error inesperado';
    
    switch(error.code) {
      case 'auth/invalid-email': return 'El correo electrónico no es válido';
      case 'auth/user-disabled': return 'Esta cuenta ha sido deshabilitada';
      case 'auth/user-not-found':
      case 'auth/wrong-password': return 'Correo o contraseña incorrectos';
      case 'auth/too-many-requests': return 'Demasiados intentos fallidos. Intenta más tarde';
      default: return error.message || 'Error al iniciar sesión';
    }
  }

  private async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async resetPassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Restablecer Contraseña',
      inputs: [{
        name: 'email',
        type: 'email',
        placeholder: 'Tu correo electrónico',
        value: this.loginForm.get('email')?.value || ''
      }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Enviar',
          handler: async (data: { email: string }): Promise<boolean> => {
            if (!data.email) {
              await this.showAlert('Error', 'Debes ingresar un correo electrónico');
              return false;
            }
            
            const loading = await this.loadingCtrl.create({
              message: 'Enviando correo...'
            });
            await loading.present();
            
            try {
              await this.fireService.resetPassword(data.email);
              await loading.dismiss();
              await this.showAlert('Éxito', 'Se ha enviado un correo para restablecer tu contraseña');
              return true;
            } catch (error: any) {
              await loading.dismiss();
              await this.showAlert('Error', this.getErrorMessage(error));
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
