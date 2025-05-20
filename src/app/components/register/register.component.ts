import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  activeField: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

   constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Por favor ingresa un correo electrónico válido';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const success = await this.authService.register(this.name, this.email, this.password);
      
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Error al registrar el usuario';
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(error: any): string {
    // Si el backend devuelve un mensaje de error específico
    if (error.error?.message) {
      return error.error.message;
    }
    
    // Manejo de errores genéricos
    if (error.status === 0) {
      return 'No se pudo conectar al servidor';
    }
    
    return 'Ocurrió un error durante el registro. Por favor inténtalo más tarde.';
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}