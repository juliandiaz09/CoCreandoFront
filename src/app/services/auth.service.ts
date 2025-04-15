import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  
  get isAuthenticated() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router) {}
  isAdmin(): boolean {
    // Implementar lógica real de verificación de admin
    return false; // Temporal
  }
  

  login(email: string, password: string) {
    if(email && password) {
      this.loggedIn.next(true);
      this.router.navigate(['/dashboard']);
    }
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}