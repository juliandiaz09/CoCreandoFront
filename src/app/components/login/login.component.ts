// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;
  activeField: string = '';
  showPassword: boolean = false;

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }

async onSubmit(): Promise<void> {
  if (!this.email || !this.password) {
    this.errorMessage = 'Por favor completa todos los campos';
    return;
  }
  this.loading = true;
  this.errorMessage = '';

  try {
    const success = await this.authService.login(this.email, this.password);
    if (success) {
      const verified = await this.authService.isEmailVerified(); // ← usa esta nueva función
      console.log(verified)

      if (verified) {
        if (this.rememberMe) {
          localStorage.setItem('rememberedEmail', this.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        this.router.navigate(['/dashboard']);
      } else {
        this.authService.logout(); // cerrar sesión
        this.errorMessage = 'Tu correo no ha sido verificado. Por favor revisa tu bandeja de entrada.';
      }
    }
  } catch (error: any) {
    // Mostrar directamente el mensaje del backend
    this.errorMessage = error.error?.message || error.message || 'Error al iniciar sesión';
    
    // Manejar códigos específicos si es necesario
    if (error.error?.code === 'email_not_verified') {
      this.errorMessage = 'Por favor verifica tu email antes de iniciar sesión';
    }
    if (error.error?.code === 'account_banned') {
      this.errorMessage = 'Cuenta suspendida. Contacta al soporte.';
    }
    if (error.error?.code === 'invalid_email_format') {
    }
  } finally {
    this.loading = false;
  }
}

private getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
      return 'Usuario no encontrado';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Intenta más tarde';
    default:
      return 'Error al iniciar sesión';
  }
}
private getErrorMessage(error: any): string {
  if (error.error?.message) {
    return error.error.message;
  }
  return 'Ocurrió un error durante el inicio de sesión. Por favor inténtalo más tarde.';
}

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  ngOnInit(): void {
    // Cargar email recordado si existe
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.email = rememberedEmail;
      this.rememberMe = true;
    }
  }
}