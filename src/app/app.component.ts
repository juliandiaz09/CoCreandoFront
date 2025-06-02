import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { UserDisplayPipe } from './pipes/user-display.pipe';
import { NotificationService, Notificacion } from './services/notification.service';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, UserDisplayPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CoCreando';
  showNotifications = false;
  unreadNotifications = 0;
  notifications: Notificacion[] = [];
  private notificationsSub!: Subscription;
  private authSub!: Subscription;
  isLoading$ = new BehaviorSubject<boolean>(true);

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.notificationsSub = this.notificationService.notifications$.subscribe(nots => {
      this.notifications = nots.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.unreadNotifications = nots.filter(n => !n.read).length;
    });

    // Cargar notificaciones cuando el usuario está autenticado
    this.isLoading$.next(true);

    this.authSub = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isLoading$.next(false);
      
      if (isAuth) {
        const userId = this.authService.getCurrentUserValue()?.uid;
        if (userId) {
          this.notificationService.cargarNotificaciones();
        }
      } else {
        this.notifications = [];
        this.unreadNotifications = 0;
      }
    });
  }

  ngOnDestroy() {
    this.notificationsSub.unsubscribe();
    this.authSub.unsubscribe();
  }


  navigateTo(route: string) {
    this.router.navigate([route]);
    this.showNotifications = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
    this.showNotifications = false;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications && this.unreadNotifications > 0) {
      this.markAllAsRead();
    }
  }

  markAllAsRead() {
    const userId = this.authService.getCurrentUserValue()?.uid;
    if (userId) {
      this.notificationService.marcarComoLeidas();
    }
  }

  handleNotificationClick(notification: Notificacion) {
    if (notification.link) {
      this.router.navigate([notification.link]);
    }
    
    if (!notification.read) {
      const userId = this.authService.getCurrentUserValue()?.uid;
      if (userId) {
        this.notificationService.marcarComoLeida(notification.id);
      }
    }
    
    this.showNotifications = false;
  }
}