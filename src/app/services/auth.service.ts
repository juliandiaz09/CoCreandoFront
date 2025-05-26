import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { auth } from '../firebase.config'; // ruta al archivo de config

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

  async firebaseRegister(name: string, email: string, password: string): Promise<boolean> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    await sendEmailVerification(userCredential.user);
    return true;
  }

  async isEmailVerified(): Promise<boolean> {
    const auth = getAuth();
    if (auth.currentUser) {
      await auth.currentUser.reload(); // 🔄 Forzar actualización del usuario
      return auth.currentUser.emailVerified;
    }
    return false;
  }


async login(email: string, password: string): Promise<boolean> {
  try {
    const response: any = await this.http.post('http://127.0.0.1:5000/login', {
      email,
      password
    }).toPromise();

    if (response && response.success) {
      const userData = {
        email: response.user?.email || email,
        name: response.user?.name || email.split('@')[0],
        id: response.user?.uid || response.user?.id || '',
        uid: response.user?.uid || response.user?.id || '',
        token: response.token,
        rol: response.user?.rol || 'usuario',
        status: response.user?.status || 'active'
      };
      
      this.loggedIn.next(true);
      this.currentUser.next(userData);
      localStorage.setItem('custom_user', JSON.stringify(userData));
      localStorage.setItem('token', response.token);
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Manejo específico de errores
    if (error.error) {
      throw {
        code: error.error.code || 'unknown_error',
        message: error.error.message || 'Error desconocido'
      };
    }
    throw error;
  }
}

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
    // Paso 1: validar con el backend (solo validación, no crear usuario)
    const response: any = await this.http.post('http://127.0.0.1:5000/registro', {
      name,
      email,
      password
    }).toPromise();

    if (response.success) {
      // Paso 2: crear usuario en Firebase y enviar verificación
      await this.firebaseRegister(name, email, password);
      return true;
    } else {
      throw { message: response.message || 'Error en validación del backend' };
    }
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

  get isAuthenticated(): boolean {
  return this.loggedIn.value;
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

  getCurrentUserValue(): any | null {
    return this.currentUser.value;
  }
}