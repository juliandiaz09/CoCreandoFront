import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../services/project.model';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    NgIf, NgFor, DecimalPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  categories = ['Todos', 'Tecnología', 'Social', 'Medio Ambiente', 'Educación'];
  selectedCategory = 'Todos';
  isLoading = true;
  error: string | null = null;
  searchTerm = '';

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.error = null;
    
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        if (projects.length === 0) {
          this.error = 'No se encontraron proyectos.';
        } else {
          this.projects = this.parseProjects(projects);
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading projects', err);
        this.error = 'No se pudieron cargar los proyectos. Por favor intenta más tarde.';
        this.isLoading = false;
        this.projects = [];
        this.filteredProjects = [];
      }
    });
  }

  private parseProjects(projects: Project[]): Project[] {
    return projects.map(p => ({
      ...p,
      deadline: new Date(p.deadline),
      updates: p.updates?.map(u => ({ ...u, date: new Date(u.date) })) || [],
      supporters: p.supporters?.map(s => ({ ...s, date: new Date(s.date) })) || []
    }));
  }
  private handleError(error: any): void {
    console.error('Error:', error);
    this.error = 'Error al cargar proyectos. Verifica la consola para más detalles.';
    this.isLoading = false;
    this.projects = [];
    this.filteredProjects = [];
  }
  applyFilters(): void {
    // Filtrar por categoría
    this.filteredProjects = this.selectedCategory === 'Todos' 
      ? [...this.projects] 
      : this.projects.filter(p => p.category === this.selectedCategory);

    // Filtrar por término de búsqueda si existe
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredProjects = this.filteredProjects.filter(project => 
        project.title.toLowerCase().includes(term) || 
        project.description.toLowerCase().includes(term) ||
        project.category.toLowerCase().includes(term)
      )
    }
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  getDaysRemaining(deadline: Date | string): number {
    if (!deadline) return 0;
    const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
    const timeDiff = deadlineDate.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
  }

  getProgressPercentage(project: Project): number {
    if (!project.goal || project.goal <= 0) return 0;
    return Math.min(100, (project.collected / project.goal) * 100);
  }

  viewDetails(projectId: string): void {
    this.router.navigate(['/project', projectId]);
  }

  refreshProjects(): void {
    this.searchTerm = '';
    this.selectedCategory = 'Todos';
    this.loadProjects();
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }
}