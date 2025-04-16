import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../services/project.model'; // Ver nota abajo

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  categories = ['Todos', 'Tecnología', 'Social', 'Medio Ambiente', 'Educación'];
  selectedCategory = 'Todos';

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        // Convertir strings de fecha a objetos Date
        this.projects = projects.map(project => ({
          ...project,
          deadline: new Date(project.deadline),
          updates: project.updates?.map(update => ({
            ...update,
            date: new Date(update.date)
          })) || [],
          supporters: project.supporters?.map(supporter => ({
            ...supporter,
            date: new Date(supporter.date)
          })) || []
        }));
      },
      error: (err) => console.error('Error loading projects', err)
    });
  }

  filterProjects() {
    return this.selectedCategory === 'Todos' 
      ? this.projects 
      : this.projects.filter(p => p.category === this.selectedCategory);
  }

  getDaysRemaining(deadline: Date): number {
    return Math.floor((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }
  // Para apoyar un proyecto
supportProject(projectId: number): void {
  const project = this.projects.find(p => p.id === projectId);
  if (project) {
    //project.supporters++;
    // Aquí podrías añadir lógica para donaciones
  }
}

  viewDetails(projectId: number) {
    this.router.navigate(['/project', projectId]);
  }
}