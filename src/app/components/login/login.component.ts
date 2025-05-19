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

  if (!this.validateEmail(this.email)) {
    this.errorMessage = 'Por favor ingresa un correo electrónico válido';
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  try {
    const success = await this.authService.login(this.email, this.password, this.rememberMe);
    if (success) {
      this.router.navigate(['/dashboard']);
    }
  } catch (error: any) {
    this.errorMessage = this.getFirebaseErrorMessage(error.code);
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