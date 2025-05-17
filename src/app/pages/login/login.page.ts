import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FireService } from 'src/app/services/fire.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  // Inyeccion de dependencias
  private fireSvc = inject(FireService);
  private utils = inject(UtilsService);

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', Validators.required)
  });

  ngOnInit() { }

  async logIn() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    const loading = await this.utils.presentLoading();
    try {
      const user = await this.fireSvc.signIn(email!, password!);
      this.utils.navigateRoot('/');
    } catch (error) {
      this.utils.presentAlert({
        header: 'Error',
        message: this.getErrorMessage(error),
        buttons: ['OK']
      });
    } finally {
      loading.dismiss();
    }
  }

  private getErrorMessage(error: any): string {
    if (!error.code) return 'Ocurrió un error inesperado';
    
    switch(error.code) {
      case 'auth/invalid-email': return 'El correo electrónico no es válido';
      case 'auth/user-disabled': return 'Esta cuenta ha sido deshabilitada';
      case 'auth/user-not-found': return 'No se encontró una cuenta con este correo electrónico';
      case 'auth/wrong-password': return 'Correo o contraseña incorrectos';
      case 'auth/too-many-requests': return 'Demasiados intentos fallidos. Intenta más tarde';
      case 'auth/invalid-credential': return 'Credenciales no válidas';
      default: return 'Error al iniciar sesión';
    }
  }
}
