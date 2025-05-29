import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}`;

   constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/listarUsuarios`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  updateUserRole(userId: string, newRole: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/actualizarUsuario/${userId}`, 
      { rol: newRole },
      { 
        headers: this.getHeaders(),
        withCredentials: true 
      }
    );
  }

  banUser(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/actualizarUsuario/${userId}`, 
      { status: 'banned' },
      { 
        headers: this.getHeaders(),
        withCredentials: true 
      }
    );
  }

  unbanUser(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/actualizarUsuario/${userId}`, 
      { status: 'active' },
      { 
        headers: this.getHeaders(),
        withCredentials: true 
      }
    );
  }

  approveProject(projectId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/proyecto/actualizarProyecto/${projectId}`, 
      { status: 'approved' },
      { 
        headers: this.getHeaders(),
        withCredentials: true 
      }
    );
  }

  rejectProject(projectId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/proyecto/actualizarProyecto/${projectId}`, 
      { status: 'rejected' },
      { 
        headers: this.getHeaders(),
        withCredentials: true 
      }
    );
  }

  getPendingProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proyecto/listarProyectosStatus/pending`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }
}