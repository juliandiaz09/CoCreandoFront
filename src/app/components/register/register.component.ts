import { Component } from '@angular/core';
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

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    // Validación básica
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

    // Simular llamada API con timeout
    setTimeout(() => {
      try {
        // En una implementación real, aquí llamarías al servicio de registro
        // Por ahora simulamos un registro exitoso
        const success = true;
        
        if (success) {
          // Auto-login después del registro
          this.authService.login(this.email, this.password, false);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Error al registrar. Por favor inténtalo de nuevo.';
        }
      } catch (error) {
        this.errorMessage = 'Ocurrió un error durante el registro.';
      } finally {
        this.loading = false;
      }
    }, 1500);
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}