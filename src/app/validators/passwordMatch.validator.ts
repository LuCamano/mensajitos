import { AbstractControl, ValidatorFn } from "@angular/forms";

export function passwordMatchValidator(campo: AbstractControl): ValidatorFn{
    return (control) => {
        const password = control.value;
        const confirmPassword = campo.value;

        if (password !== confirmPassword) {
            return { passwordMismath: true};
        } else {
            return null
        }
    }
}