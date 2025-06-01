import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms'; // <-- Importa esto
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule,], // <-- Añádelo aquí
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
  
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

onSubmit() {
  this.successMessage = '';
  this.errorMessage = '';
  this.isLoading = true;

  this.authService.sendPasswordResetEmail(this.email)
    .then(() => {
      this.successMessage = 'Correo de recuperación enviado. Revisa tu bandeja de entrada.';
      this.email = '';
    })
    .catch((error) => {
      if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'El correo ingresado no es válido.';
      } else if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'No hay usuario registrado con ese correo.';
      } else {
        this.errorMessage = 'Ocurrió un error. Intenta de nuevo.';
      }
    })
    .finally(() => {
      this.isLoading = false;
    });
}

}