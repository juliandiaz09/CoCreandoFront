// project-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: any = null;
  investmentAmount: number = 0;
  currentUser: any;
  isLoading = true;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadProject(projectId);
  }

  loadProject(projectId: number): void {
    this.isLoading = true;
    this.error = null;
    
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        const foundProject = projects.find(p => p.id === projectId);
        
        if (!foundProject) {
          this.router.navigate(['/dashboard']);
          return;
        }
        
        // Transformar fechas y asegurar datos opcionales
        this.project = {
          ...foundProject,
          deadline: new Date(foundProject.deadline),
          longDescription: foundProject.longDescription || `Este proyecto busca ${foundProject.description.toLowerCase()} a través de un enfoque innovador y colaborativo.`,
          location: foundProject.location || 'Ubicación no especificada',
          creator: foundProject.creator || this.getDefaultCreator(),
          risksAndChallenges: foundProject.risksAndChallenges || 'No se han especificado los retos y desafíos de este proyecto.',
          rewards: foundProject.rewards || this.getDefaultRewards(),
          updates: (foundProject.updates || []).map((update: any) => ({
            ...update,
            date: new Date(update.date)
          })),
          supporters: (foundProject.supporters || []).map((supporter: any) => ({
            ...supporter,
            date: new Date(supporter.date)
          }))
        };
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading project', err);
        this.error = 'No se pudo cargar el proyecto. Por favor intenta más tarde.';
        this.isLoading = false;
      }
    });
  }
  private getDefaultCreator() {
    return {
      name: 'Creador Anónimo',
      email: 'contacto@proyecto.com',
      bio: 'Información no disponible sobre el creador de este proyecto.',
      avatar: 'https://randomuser.me/api/portraits/lego/0.jpg'
    };
  }

  private getDefaultRewards() {
    return [
      {
        title: 'Agradecimiento público',
        description: 'Mención en nuestras redes sociales y página web.',
        minimumAmount: 10
      },
      {
        title: 'Kit del proyecto',
        description: 'Recibirás un kit con productos relacionados al proyecto.',
        minimumAmount: 50
      }
    ];
  }
  invest() {
    if (this.investmentAmount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    
    if (!this.currentUser) {
      alert('Debes iniciar sesión para invertir');
      this.router.navigate(['/login']);
      return;
    }
    
    // Actualizar el proyecto
    this.project.collected += this.investmentAmount;
    this.project.supporters.push({
      name: this.currentUser.email,
      amount: this.investmentAmount,
      date: new Date()
    });
    
    alert(`¡Gracias por tu inversión de $${this.investmentAmount}!`);
    this.investmentAmount = 0;
  }

  getDaysRemaining(deadline: Date): number {
    return Math.floor((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }

  getTopSupporters(): any[] {
    return [...this.project.supporters]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }
}