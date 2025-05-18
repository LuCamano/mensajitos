import { Component, inject, OnInit } from '@angular/core';
import { FireService } from 'src/app/services/fire.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {
  // Inyección de dependencias
  private fireSvc = inject(FireService);
  private utils = inject(UtilsService);

  email!: string;

  ngOnInit() {
  }

  async sendEmail() {
    if (!this.email) throw new Error('Email is required');
    const loading = await this.utils.presentLoading();
    try {
      await this.fireSvc.resetPassword(this.email);
      this.utils.navigateRoot('/login');
      this.utils.presentToast({
        header: 'Correo enviado',
        message: 'Por favor revisa tu correo para restablecer tu contraseña',
        duration: 3000,
        position: 'bottom',
        color: 'success'
      })
    } catch (error) {
      this.utils.presentAlert({
        header: 'No se pudo enviar el correo',
        message: 'Por favor verifica que el correo sea correcto',
        buttons: ['OK']
      })
    } finally {
      loading.dismiss();
    }
  }
}
