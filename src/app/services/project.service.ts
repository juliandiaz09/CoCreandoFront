import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { Project } from './project.model';
import { environment } from '../environments/environment';
import { Auth, authState, idToken } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private apiUrl = environment.apiUrl || 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
  return this.http.get<Project[]>(`${this.apiUrl}/proyecto/listarProyectos`, {
    withCredentials: true
  }).pipe(
    catchError((error) => {
      console.error('Error fetching projects from API:', error);
      return of([]);
    })
  );
}

  getProjectAnalytics(projectId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/analytics/${projectId}`);
}

  getProjectById(id: string): Observable<Project | null> {
    return this.http.get<Project>(`${this.apiUrl}/proyecto/obtenerProyecto/${id}`, {
      withCredentials: true
    }).pipe(
      catchError((error) => {
        console.error(`Error fetching project ${id}:`, error);
        return of(null);
      })
    );
  }

  createProject(projectData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearProyecto`, projectData).pipe(
      catchError((error) => {
        console.error('Error creating project:', error);
        throw error;
      })
    );
  }

  updateProject(id: string, projectData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizarProyecto/${id}`, projectData).pipe(
      catchError((error) => {
        console.error(`Error updating project ${id}:`, error);
        throw error;
      })
    );
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminarProyecto/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting project ${id}:`, error);
        throw error;
      })
    );
  }
}