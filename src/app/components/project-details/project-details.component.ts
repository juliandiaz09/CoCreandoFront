import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: any;
  investmentAmount: number = 0;
  currentUser: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardComponent: DashboardComponent,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.project = this.dashboardComponent.projects.find(p => p.id === projectId);
    
    if (!this.project) {
      this.router.navigate(['/dashboard']);
      return;
    }
    
    // Añadir datos de ejemplo si no existen
    if (!this.project.longDescription) {
      this.project.longDescription = `Este proyecto busca ${this.project.description.toLowerCase()} a través de un enfoque innovador y colaborativo. Con tu apoyo, podremos hacer realidad esta iniciativa que beneficiará a toda la comunidad.`;
    }
    
    if (!this.project.location) {
      this.project.location = 'Bogotá, Colombia';
    }
    
    if (!this.project.creator) {
      this.project.creator = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        bio: 'Emprendedor social con 5 años de experiencia en proyectos comunitarios.',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
    }
    
    if (!this.project.risksAndChallenges) {
      this.project.risksAndChallenges = 'Los principales retos incluyen la obtención de permisos municipales y la participación activa de la comunidad. Hemos identificado soluciones potenciales para cada uno de estos desafíos.';
    }
    
    if (!this.project.rewards || this.project.rewards.length === 0) {
      this.project.rewards = [
        {
          title: 'Agradecimiento público',
          description: 'Mención en nuestras redes sociales y página web.',
          minimumAmount: 10
        },
        {
          title: 'Kit del proyecto',
          description: 'Recibirás un kit con productos relacionados al proyecto.',
          minimumAmount: 50
        },
        {
          title: 'Experiencia VIP',
          description: 'Participación en el lanzamiento del proyecto y encuentro con el equipo.',
          minimumAmount: 100
        }
      ];
    }
    
    if (!this.project.updates || this.project.updates.length === 0) {
      this.project.updates = [
        {
          date: new Date(),
          title: '¡Primer día del proyecto!',
          content: 'Hemos lanzado oficialmente nuestra campaña. Gracias a todos por su apoyo inicial.'
        }
      ];
    }
    
    if (!this.project.supporters || this.project.supporters.length === 0) {
      this.project.supporters = [
        {
          name: 'María Gómez',
          amount: 500,
          date: new Date()
        },
        {
          name: 'Carlos Rodríguez',
          amount: 300,
          date: new Date()
        }
      ];
    }
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
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