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
        name: response.user?.name || email.split('@')[0],
        id: response.user?.id || '',
        token: response.token  // 👈 token de Firebase
      };
      
      this.loggedIn.next(true);
      this.currentUser.next(userData);
      localStorage.setItem('custom_user', JSON.stringify(userData));
      console.log('token auth service --->', response.token);
      localStorage.setItem('token', response.token);  // 👈 guardar token por separado (opcional)
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


async register(name: string, email: string, password: string): Promise<boolean> {
  try {
    // Cambiar la URL a '/registro'
    const response: any = await this.http.post('http://127.0.0.1:5000/registro', {
      name,
      email,
      password
    }).toPromise();

    if (response.success) {
      const userData = {
        email: response.user.email,
        name: response.user.name,
        id: response.user.uid,  // Usar 'uid' en lugar de 'id'
        rol: response.user.rol,  // Añadir el rol desde la respuesta
        token: response.token    // Añadir el token
      };
      
      this.loggedIn.next(true);
      this.currentUser.next(userData);
      localStorage.setItem('custom_user', JSON.stringify(userData));
      localStorage.setItem('token', response.token); // Guardar token
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
  
  getToken(): string | null {
    const userDataRaw = localStorage.getItem('custom_user');
    if (userDataRaw) {
      const userData = JSON.parse(userDataRaw);
      return userData?.token || null;
    }
    return null;
  }
}
