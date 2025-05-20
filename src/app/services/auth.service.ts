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

   constructor(private http: HttpClient, private router: Router) {
    // Cargar usuario desde localStorage al iniciar
    const savedUser = localStorage.getItem('custom_user');
    if (savedUser) {
      this.currentUser.next(JSON.parse(savedUser));
      this.loggedIn.next(true);
    }
  }
  // auth.service.ts
async login(email: string, password: string): Promise<boolean> {
  try {
    const response: any = await this.http.post('http://127.0.0.1:5000/login', {
      email,
      password
    }).toPromise();

    console.log('Login response:', response); // Para depuración

    if (response && response.success) {
      const userData = {
        email: response.user?.email || email,
        name: response.user?.name || email.split('@')[0], // Usa el nombre o la parte antes del @
        id: response.user?.id || ''
      };
      
      this.loggedIn.next(true);
      this.currentUser.next(userData);
      localStorage.setItem('custom_user', JSON.stringify(userData));
      return true;
    } else {
      console.error('Login failed:', response);
      return false;
    }
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
}

  // Añade este método para obtener los datos completos del usuario
  async fetchUserProfile(): Promise<any> {
    try {
      const response = await this.http.get('http://127.0.0.1:5000/api/users/me').toPromise();
      this.currentUser.next(response);
      localStorage.setItem('custom_user', JSON.stringify(response));
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // auth.service.ts
async register(name: string, email: string, password: string): Promise<boolean> {
  try {
    const response: any = await this.http.post('http://127.0.0.1:5000/register', {
      name,
      email,
      password
    }).toPromise();

    if (response.success) {
      const userData = {
        email: response.user.email,
        name: response.user.name,  // Asegúrate que el backend devuelva el nombre
        id: response.user.id
      };
      
      this.loggedIn.next(true);
      this.currentUser.next(userData);
      localStorage.setItem('custom_user', JSON.stringify(userData));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Register error:', error);
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
