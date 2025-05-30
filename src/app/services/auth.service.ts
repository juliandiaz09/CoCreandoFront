import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<any | null>(null);
   private initialized = false;

   constructor(private http: HttpClient, private router: Router) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    if (this.initialized) return;
    this.initialized = true;

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          await this.loadUserData(user);
        } else {
          this.handleUnverifiedUser();
        }
      } else {
        this.handleNoUser();
      }
    });
  }

  private async loadUserData(user: any) {
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      const userData = userDoc.exists() ? userDoc.data() : {};
      const fullUserData = {
        email: user.email,
        name: user.displayName || user.email?.split('@')[0],
        id: user.uid,
        uid: user.uid,
        token: await user.getIdToken(),
        role: userData['role'] || userData['rol'] || 'usuario',
        status: userData['status'] || 'active'
      };

      this.loggedIn.next(true);
      this.currentUser.next(fullUserData);
      localStorage.setItem('custom_user', JSON.stringify(fullUserData));
      localStorage.setItem('token', fullUserData.token);
    } catch (error) {
      console.error('Error loading user data:', error);
      this.handleNoUser();
    }
  }

  private handleUnverifiedUser() {
    this.loggedIn.next(false);
    this.currentUser.next(null);
    localStorage.removeItem('custom_user');
    localStorage.removeItem('token');
    this.router.navigate(['/login'], { 
      queryParams: { message: 'Por favor verifica tu correo electrónico' } 
    });
  }

  private handleNoUser() {
    this.loggedIn.next(false);
    this.currentUser.next(null);
  }

async firebaseLogin(email: string, password: string): Promise<boolean> {
  try {
    const backendResponse: any = await this.http.post('http://127.0.0.1:5000/login', {
      email,
      password
    }).toPromise();

    if (!backendResponse?.success) {
      throw {
        code: backendResponse?.code || 'backend_error',
        message: backendResponse?.message || 'Error en la validación del backend'
      };
    }

    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await userCredential.user.reload();

    if (!userCredential.user.emailVerified) {
      throw { 
        code: 'email_not_verified', 
        message: 'Por favor verifica tu correo electrónico antes de iniciar sesión' 
      };
    }

    const db = getFirestore();
    const userRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userRef);
    
    const userData = userDoc.exists() ? userDoc.data() : {};
    const fullUserData = {
      email: userCredential.user.email,
      name: userCredential.user.displayName || userCredential.user.email?.split('@')[0],
      id: userCredential.user.uid,
      uid: userCredential.user.uid,
      token: await userCredential.user.getIdToken(),
      role: userData['role'] || userData['rol'] || 'usuario',
      status: userData['status'] || 'active'
    };

    this.loggedIn.next(true);
    this.currentUser.next(fullUserData);
    localStorage.setItem('custom_user', JSON.stringify(fullUserData));
    localStorage.setItem('token', fullUserData.token);

    return true;
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.code?.startsWith('auth/')) {
      switch (error.code) {
        case 'auth/user-not-found':
          throw { code: 'user_not_found', message: 'Usuario no encontrado' };
        case 'auth/wrong-password':
          throw { code: 'wrong_credentials', message: 'Contraseña incorrecta' };
        case 'auth/too-many-requests':
          throw { code: 'too_many_attempts', message: 'Demasiados intentos. Intenta más tarde' };
        default:
          throw { code: 'firebase_error', message: error.message || 'Error de autenticación' };
      }
    }
    
    throw error;
  }
}

  async firebaseRegister(name: string, email: string, password: string): Promise<boolean> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(userCredential.user, { displayName: name });

    await sendEmailVerification(userCredential.user);
    // Guardar en Firestore
    const firestore = getFirestore();
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
      role: 'usuario',
      status: 'active'
    });
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

  isAdmin(): boolean {
    const user = this.getCurrentUserValue();
    return user?.role?.toLowerCase() === 'admin';
  }

  /*
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
          role: response.user?.role || 'usuario',
          status: response.user?.status || 'active'
        };

        this.loggedIn.next(true);
        this.currentUser.next(userData);
        console.log(userData.id);
        localStorage.setItem('user_id', userData.id);
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
*/
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
    return localStorage.getItem('token');
  }

  getCurrentUserValue(): any | null {
    return this.currentUser.value;
  }
}