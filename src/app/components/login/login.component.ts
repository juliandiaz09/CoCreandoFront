import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }

  onSubmit(): void {
    // Validación básica
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Por favor ingresa un correo electrónico válido';
      return;
    }

    // Simular carga
    this.loading = true;
    this.errorMessage = '';

    // Simular llamada API
    setTimeout(() => {
      this.loading = false;
      
      // Lógica de autenticación temporal
      if (this.email && this.password) {
        if (this.rememberMe) {
          // Guardar en localStorage si "Recordarme" está marcado
          localStorage.setItem('rememberedEmail', this.email);
        }
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Credenciales incorrectas. Por favor inténtalo de nuevo.';
      }
    }, 1500);
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