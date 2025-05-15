// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<any>(null);
  
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.checkAuthState();
  }

  get isAuthenticated$() {
    return this.loggedIn.asObservable();
  }

  get currentUser$() {
    return this.currentUser.asObservable();
  }

  login(email: string, password: string, rememberMe: boolean = false): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.handleAuthentication(response, rememberMe);
        }
      }),
      map(response => !!response.token),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  private handleAuthentication(authData: any, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('firebase_token', authData.token);
    storage.setItem('user_data', JSON.stringify(authData.user));
    
    this.loggedIn.next(true);
    this.currentUser.next(authData.user);
  }

  logout(): void {
    this.loggedIn.next(false);
    this.currentUser.next(null);
    localStorage.removeItem('firebase_token');
    sessionStorage.removeItem('firebase_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('user_data');
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    const user = this.currentUser.value;
    return user && user.rol === 'administrador';
  }

  private checkAuthState(): void {
    const token = localStorage.getItem('firebase_token') || sessionStorage.getItem('firebase_token');
    const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    
    if (token && userData) {
      this.loggedIn.next(true);
      this.currentUser.next(JSON.parse(userData));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('firebase_token') || sessionStorage.getItem('firebase_token');
  }
}