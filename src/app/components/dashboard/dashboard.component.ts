import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Project {
  id: number;
  title: string;
  description: string;
  goal: number;
  collected: number;
  category: string;
  deadline: Date;
  //supporters: number; // Nuevo campo
  //isFeatured: boolean; // Nuevo campo
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
    {
      id: 2,
      title: 'App Educativa',
      description: 'Desarrollo de aplicación para aprendizaje de idiomas',
      goal: 8000,
      collected: 4500,
      category: 'Tecnología',
      deadline: new Date('2025-10-15')
    },
    {
      id: 3,
      title: 'Comedor Comunitario',
      description: 'Alimentación para familias necesitadas del barrio',
      goal: 3000,
      collected: 2100,
      category: 'Social',
      deadline: new Date('2025-08-30')
    },
    {
      id: 4,
      title: 'Talleres de Programación',
      description: 'Cursos gratuitos de programación para jóvenes',
      goal: 4000,
      collected: 3800,
      category: 'Educación',
      deadline: new Date('2025-11-20')
    },
    {
      id: 5,
      title: 'Energías Renovables',
      description: 'Instalación de paneles solares en escuelas rurales',
      goal: 12000,
      collected: 7500,
      category: 'Medio Ambiente',
      deadline: new Date('2026-03-01')
    },
    {
      id: 6,
      title: 'Robot Asistencial',
      description: 'Desarrollo de robot para asistencia a personas mayores',
      goal: 15000,
      collected: 9200,
      category: 'Tecnología',
      deadline: new Date('2025-09-30')
    },
    {
      id: 7,
      title: 'Biblioteca Móvil',
      description: 'Unidad móvil de préstamo de libros para zonas alejadas',
      goal: 6000,
      collected: 4200,
      category: 'Educación',
      deadline: new Date('2025-07-15')
    },
    {
      id: 8,
      title: 'Huertos Urbanos',
      description: 'Creación de espacios de cultivo en terrazas comunitarias',
      goal: 3500,
      collected: 1800,
      category: 'Social',
      deadline: new Date('2025-08-10')
    },
    {
      id: 9,
      title: 'Realidad Virtual Educativa',
      description: 'Desarrollo de contenido VR para enseñanza de historia',
      goal: 10000,
      collected: 6300,
      category: 'Tecnología',
      deadline: new Date('2025-12-01')
    },
    {
      id: 10,
      title: 'Campaña de Reciclaje',
      description: 'Concienciación y puntos de recogida selectiva',
      goal: 4500,
      collected: 2900,
      category: 'Medio Ambiente',
      deadline: new Date('2025-09-15')
    },
    {
      id: 11,
      title: 'Taller de Robótica',
      description: 'Equipamiento para taller escolar de robótica',
      goal: 7000,
      collected: 5100,
      category: 'Educación',
      deadline: new Date('2025-10-30')
    },
    {
      id: 12,
      title: 'Red de Apoyo Psicológico',
      description: 'Servicio gratuito de atención psicológica',
      goal: 5500,
      collected: 3200,
      category: 'Social',
      deadline: new Date('2025-11-10')
    }
  ];

  categories = ['Todos', 'Tecnología', 'Social', 'Medio Ambiente', 'Educación'];
  selectedCategory = 'Todos';

  constructor(private router: Router) {}

  filterProjects() {
    return this.selectedCategory === 'Todos' 
      ? this.projects 
      : this.projects.filter(p => p.category === this.selectedCategory);
  }

  // Para calcular días restantes
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