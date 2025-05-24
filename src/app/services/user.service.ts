import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
    const token = userData?.token;

    console.log("Estructura completa de userData:", userData);
    console.log("Tipo de token:", typeof userData.token);
    console.log("Contenido de token:", userData.token);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + String(token) // Fuerza la conversión a string
    });

 
    console.log('HEADERS:', headers.get('Authorization'));

    return this.http.get(`${this.apiUrl}/usuario/obtenerUsuario/${id}`, { headers });
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Agrega otros métodos según necesites
}