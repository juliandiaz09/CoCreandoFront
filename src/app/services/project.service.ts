import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { Project } from './project.model';
import { environment } from '../environments/environment';
import { Auth, authState, idToken } from '@angular/fire/auth';
import { AuthService } from './auth.service';

interface ProjectResponse {
  projectId?: string;
  mensaje?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private apiUrl = environment.apiUrl || 'https://cocreandoback.onrender.com';

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) {}

getProjects(): Observable<Project[]> {
  // Obtener el usuario actual desde localStorage
  const userJson = localStorage.getItem('custom_user');
  const currentUser = userJson ? JSON.parse(userJson) : null;
  const isAdmin = currentUser?.role === 'admin';

  return this.http.get<Project[]>(`${this.apiUrl}/proyecto/listarProyectos`, {
    withCredentials: true
  }).pipe(
    // Filtrar proyectos si no es admin
    switchMap((projects: Project[]) => {
      if (isAdmin) {
        return of(projects);
      } else {
        const filtered = projects.filter(p => p.status === 'approved');
        return of(filtered);
      }
    }),
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

  createProject(projectData: any): Observable<ProjectResponse> {
  // Asegurarnos de que el ID sea generado correctamente
  if (!projectData.id) {
    projectData.id = this.generateProjectId();
  }

  // Convertir fechas a formato ISO si es necesario
  if (projectData.deadline) {
    projectData.deadline = new Date(projectData.deadline).toISOString();
  }

  // Asegurar que las recompensas y actualizaciones tengan la estructura correcta
  projectData.rewards = projectData.rewards || [];
  projectData.updates = projectData.updates || [];
  projectData.supporters = [];

    // 👇 Obtener datos del usuario actual desde AuthService
  // const currentUserString = localStorage.getItem("custom_user");//this.authService.getCurrentUserValue();
  // if (currentUserString) {
  //   const currentUser = JSON.parse(currentUserString); // ✅ Convertir a objeto
  //   projectData.creator = {
  //     uid: currentUser.uid,
  //     name: currentUser.name,
  //     email: currentUser.email
  //   };
  // }


  const token = this.authService.getToken(); // Ahora debería funcionar
    
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

    return this.http.post(`${this.apiUrl}/proyecto/crearProyecto`, projectData, { 
      headers,
      withCredentials: true 
    }).pipe(
      catchError((error) => {
        console.error('Error creating project:', error);
        throw error;
      })
    );
  }

private generateProjectId(): string {
  return 'proj-' + Math.random().toString(36).substr(2, 9);
}

  updateProject(id: string, projectData: any): Observable<any> {
  const token = this.authService.getToken();
  
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  return this.http.put(`${this.apiUrl}/proyecto/actualizarProyecto/${id}`, projectData, {
    headers,
    withCredentials: true
  }).pipe(
    catchError((error) => {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    })
  );
}

  deleteProject(id: string): Observable<any> {
  const token = this.authService.getToken();
  
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  return this.http.delete(`${this.apiUrl}/proyecto/eliminarProyecto/${id}`, {
    headers,
    withCredentials: true
  }).pipe(
    catchError((error) => {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    })
  );
}
}