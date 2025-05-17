import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FireService } from 'src/app/services/fire.service';
import { UtilsService } from 'src/app/services/utils.service';
import { passwordMatchValidator } from 'src/app/validators/passwordMatch.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {
  private fireSvc = inject(FireService);
  private utils = inject(UtilsService);

  signupForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl('', [
      Validators.required, 
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPassword: new FormControl('')
  });

  ngOnInit() {
    this.signupForm.controls.confirmPassword.setValidators([
      Validators.required, 
      Validators.minLength(6), 
      passwordMatchValidator(this.signupForm.controls.password)
    ]);
  }

  async onSubmit() {
    if (this.signupForm.invalid) return;

    const { name, email, password } = this.signupForm.value;
    const loading = await this.utils.presentLoading();

    try {
      await this.fireSvc.signUp(email!, password!, name!);
      this.utils.navigateRoot('/home');
    } catch (error) {
      this.utils.presentAlert({
        header: 'Error',
        message: this.parseError(error),
        buttons: ['OK']
      });
    } finally {
      loading.dismiss();
    }
  }

  private parseError(error: any): string {
    const errors: Record<string, string> = {
      'auth/email-already-in-use': 'El correo ya está registrado',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Correo electrónico no válido'
    };
    return errors[error.code] || 'Error durante el registro';
  }
}