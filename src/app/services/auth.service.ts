import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response: any = await this.http.post('http://127.0.0.1:5000/login', {
        email,
        password
      }).toPromise();

      if (response.success) {
        this.loggedIn.next(true);
        this.currentUser.next({ email });
        localStorage.setItem('custom_user', JSON.stringify({ email }));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('custom_user');
    sessionStorage.removeItem('custom_user');
    this.loggedIn.next(false);
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  get isAuthenticated$() {
    return this.loggedIn.asObservable();
  }

  get currentUser$() {
    return this.currentUser.asObservable();
  }
}
