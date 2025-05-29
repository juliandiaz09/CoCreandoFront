import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { filter, take, map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      filter(isAuth => isAuth !== null), // Espera hasta que la autenticación se resuelva
      take(1),
      switchMap(() => this.authService.currentUser$),
      map(user => {
        if (user && user.role?.toLowerCase() === 'admin') {
          return true;
        }
        
        this.router.navigate(['/dashboard'], {
          queryParams: { message: 'No tienes permisos de administrador' }
        });
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/dashboard']);
        return of(false);
      })
    );
  }
}