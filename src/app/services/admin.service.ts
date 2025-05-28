import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/listarUsuarios`, {
      withCredentials: true
    });
  }

  updateUserRole(userId: string, newRole: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/actualizarUsuario/${userId}`, 
      { rol: newRole },
      { withCredentials: true }
    );
  }

  banUser(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/actualizarUsuario/${userId}`, 
      { status: 'banned' },
      { withCredentials: true }
    );
  }

  approveProject(projectId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/proyecto/actualizarProyecto/${projectId}`, 
      { status: 'approved' },
      { withCredentials: true }
    );
  }

  rejectProject(projectId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/proyecto/actualizarProyecto/${projectId}`, 
      { status: 'rejected' },
      { withCredentials: true }
    );
  }

  getPendingProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proyecto/listarProyectosStatus/pending`, {
      withCredentials: true
    });
  }
}