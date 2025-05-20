import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Project } from './project.model';
import ProyectosJson from '../assets/data/projects.json';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private apiUrl = environment.apiUrl || 'http://localhost:5000';
  private projectsUrl = `${this.apiUrl}/listarProyectos`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectsUrl).pipe(
      catchError((error) => {
        console.error('Error fetching projects from API:', error);
        console.warn('Using fallback project data due to API error');
        return of(this.getFallbackProjects());
      })
    );
  }

  getProjectAnalytics(projectId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/analytics/${projectId}`);
}

  getProjectById(id: string): Observable<Project | null> {
    return this.http.get<Project>(`${this.apiUrl}/obtenerProyecto/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching project ${id} from API:`, error);
        const fallbackProject = this.getFallbackProjects().find(p => p.id.toString() === id);
        return of(fallbackProject || null);
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

  private getFallbackProjects(): Project[] {
    try {
      if (!ProyectosJson || ProyectosJson.length === 0) {
        throw new Error('Fallback JSON data is empty or invalid');
      }
      // Mapear los datos del JSON local al modelo de Project
      return ProyectosJson.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        longDescription: p.longDescription,
        goal: p.goal,
        collected: p.collected,
        category: p.category,
        deadline: p.deadline,
        location: p.location,
        creator: p.creator,
        risksAndChallenges: p.risksAndChallenges,
        rewards: p.rewards,
        updates: p.updates,
        supporters: p.supporters
      }));
    } catch (error) {
      console.error('Error loading fallback projects:', error);
      return [];
    }
  }
}