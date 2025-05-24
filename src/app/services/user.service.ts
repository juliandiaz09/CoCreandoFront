import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';  // <-- Importaciones añadidas
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //private apiUrl = `${environment.apiUrl}/users`;
  private apiUrl = `${environment.apiUrl}`;


  constructor(private http: HttpClient) {}

  getCurrentUser(id: string): Observable<any> {
  const userDataRaw = localStorage.getItem('custom_user');
  if (!userDataRaw) {
    return throwError(() => new Error('No user data available'));
  }

  const userData = JSON.parse(userDataRaw);
  const token = userData?.token;

  if (!token) {
    return throwError(() => new Error('No authentication token available'));
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this.http.get(`${this.apiUrl}/usuario/obtenerUsuario/${id}`, { 
    headers,
    withCredentials: true
  }).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error fetching user:', error);
      if (error.status === 404) {
        const basicUser = {
          uid: id,
          email: userData.email,
          name: userData.name || userData.email.split('@')[0],
          rol: 'usuario',
          status: 'active'
        };
        return of(basicUser);
      }
      return throwError(() => error);
    })
  );
}

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Agrega otros métodos según necesites
}