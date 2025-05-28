import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { UserDisplayPipe } from './pipes/user-display.pipe';
import { NotificationService, Notificacion } from './services/notification.service';

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
  unreadNotifications = 0; // Ejemplo - deberías obtener esto de tu servicio
  notifications: Notificacion[] = []; // Ejemplo - deberías obtener esto de tu servicio

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe(nots => {
      console.log('[👀] Notificaciones en componente:', nots);

      this.notifications = nots;
      this.unreadNotifications = nots.filter(n => !n.read).length;
    });
  }

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
      const userId = localStorage.getItem('user_id');
      if (userId) {
        this.notificationService.marcarComoLeidas(userId);
      }
    }
  }
}