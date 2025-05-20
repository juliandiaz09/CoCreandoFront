import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, User, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseApp: FirebaseApp;
  private auth: Auth;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(private router: Router) {
    this.firebaseApp = initializeApp(environment.firebaseConfig);
    this.auth = initializeAuth(this.firebaseApp, {
      persistence: indexedDBLocalPersistence
    });
    this.setupAuthStateListener();
  }

  private setupAuthStateListener() {
    this.auth.onAuthStateChanged(user => {
      this.loggedIn.next(!!user);
      this.currentUser.next(user);
      
      // Guardar en almacenamiento según preferencia
      if (user) {
        sessionStorage.setItem('firebase_user', JSON.stringify(user));
      }
    });
  }

  async login(email: string, password: string, rememberMe: boolean = false): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      
      if (rememberMe) {
        localStorage.setItem('firebase_user', JSON.stringify(userCredential.user));
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  isAdmin(): boolean {
    const user = this.currentUser.value;
    return user?.email?.endsWith('@admin.com') || false;
  }

  logout(): void {
    this.auth.signOut();
    localStorage.removeItem('firebase_user');
    sessionStorage.removeItem('firebase_user');
    this.router.navigate(['/login']);
  }

  get isAuthenticated$() {
    return this.loggedIn.asObservable();
  }

  get currentUser$() {
    return this.currentUser.asObservable();
  }

  async getToken(): Promise<string | null> {
    return this.auth.currentUser?.getIdToken() ?? null;
  }

  getTokenSync(): string | null {
    // Solo para uso en el interceptor, no recomendado para otros usos
    const user = JSON.parse(sessionStorage.getItem('firebase_user') || localStorage.getItem('firebase_user') || 'null');
    return user?.stsTokenManager?.accessToken || null;
  }
}