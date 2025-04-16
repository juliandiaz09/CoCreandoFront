// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<any>(null);
  
  get isAuthenticated$() {
    return this.loggedIn.asObservable();
  }

  get currentUser$() {
    return this.currentUser.asObservable();
  }

  constructor(private router: Router) {
    // Verificar si hay un usuario en localStorage al iniciar
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.loggedIn.next(true);
      this.currentUser.next(JSON.parse(user));
    }
  }

  isAdmin(): boolean {
    const user = this.currentUser.value;
    return user && user.role === 'admin';
  }

  login(email: string, password: string, rememberMe: boolean = false) {
    // Aquí deberías hacer una llamada real a tu API de autenticación
    // Esto es solo una simulación
    
    // Simulamos un usuario admin si el email contiene "admin"
    const role = email.includes('admin') ? 'admin' : 'user';
    const user = { email, role };
    
    this.loggedIn.next(true);
    this.currentUser.next(user);
    
    if (rememberMe) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    this.router.navigate(['/dashboard']);
    return true;
  }

  logout() {
    this.loggedIn.next(false);
    this.currentUser.next(null);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.currentUser.value;
  }
}