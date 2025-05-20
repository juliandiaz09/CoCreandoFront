import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { UserDisplayPipe } from './pipes/user-display.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, UserDisplayPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'CoCreando';
  showNotifications = false;
  unreadNotifications = 2; // Ejemplo - deberías obtener esto de tu servicio
  notifications = [
    { id: 1, message: 'Nuevo comentario en tu proyecto' },
    { id: 2, message: 'Tienes una nueva colaboración' }
  ]; // Ejemplo - deberías obtener esto de tu servicio

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      // Aquí podrías marcar las notificaciones como leídas
      this.unreadNotifications = 0;
    }
  }
}