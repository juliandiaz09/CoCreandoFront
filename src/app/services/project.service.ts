import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Project } from './project.model';
import ProyectosJson from '../assets/data/projects.json';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private projectsUrl = '../assets/data/projects.json'; // Ajusta esta URL según tu API real

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectsUrl).pipe(
      catchError((error) => {
        console.error('Error fetching projects from API:', error);
        // Devuelve los proyectos del fallback con un mensaje de error en la consola
        console.warn('Using fallback project data due to API error');
        return of(this.getFallbackProjects());
      })
    );
  }

  private getFallbackProjects(): Project[] {
    try {
      if (!ProyectosJson || ProyectosJson.length === 0) {
        throw new Error('Fallback JSON data is empty or invalid');
      }
      return ProyectosJson;
    } catch (error) {
      console.error('Error loading fallback projects:', error);
      // Devuelve un array vacío como último recurso
      return [];
    }
  }
}