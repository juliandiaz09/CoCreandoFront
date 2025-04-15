import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';



interface Project {
  id: number;
  title: string;
  description: string;
  goal: number;
  collected: number;
  category: string;
  deadline: Date;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
  projects: Project[] = [
    {
      id: 1,
      title: 'Proyecto Ecológico',
      description: 'Reforestación de áreas verdes urbanas',
      goal: 5000,
      collected: 3200,
      category: 'Medio Ambiente',
      deadline: new Date('2025-12-31')
    },
    // Más proyectos...
  ];

  categories = ['Todos', 'Tecnología', 'Social', 'Medio Ambiente', 'Educación'];
  selectedCategory = 'Todos';

  filterProjects() {
    return this.selectedCategory === 'Todos' 
      ? this.projects 
      : this.projects.filter(p => p.category === this.selectedCategory);
  }
}