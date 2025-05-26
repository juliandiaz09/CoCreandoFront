import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  projectId: string = '';
  project: any = null;
  investmentAmount: number = 0;
  currentUser: any;
  isLoading = true;
  error: string | null = null;
  isProcessingPayment = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id') || '';
      
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });

      if (this.projectId) {
        this.loadProject(this.projectId);
      } else {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      }
    });
  }

  loadProject(projectId: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        if (!project) {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
          return;
        }
      
        this.project = {
          ...project,
          deadline: new Date(project.deadline),
          longDescription: project.longDescription || `Este proyecto busca ${project.description.toLowerCase()} a través de un enfoque innovador y colaborativo.`,
          location: project.location || 'Ubicación no especificada',
          creator: project.creator || this.getDefaultCreator(),
          risksAndChallenges: project.risksAndChallenges || 'No se han especificado los retos y desafíos de este proyecto.',
          rewards: project.rewards || this.getDefaultRewards(),
          updates: (project.updates || []).map((update: any) => ({
            ...update,
            date: new Date(update.date)
          })),
          supporters: (project.supporters || []).map((supporter: any) => ({
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

    if (this.investmentAmount > (this.project.goal - this.project.collected)) {
      alert('El monto ingresado supera lo que falta para alcanzar la meta del proyecto');
      return;
    }

    this.isProcessingPayment = true;

    // Datos para el pago
    const paymentData = {
      id_proyecto: this.projectId,
      descripcion: `Inversión en ${this.project.title}`,
      valor: this.investmentAmount,
      email: this.currentUser.email
    };

    // Llamar al backend para procesar el pago
    this.http.post(`${environment.apiUrl}/pasarela/crear-pago`, paymentData, { responseType: 'text' })
      .subscribe({
        next: (htmlForm) => {
          // Abrir una nueva ventana con el formulario de pago
          const payuWindow = window.open('', 'PayU', 'width=800,height=600');
          if (payuWindow) {
            payuWindow.document.write(htmlForm);
          } else {
            // Si el popup fue bloqueado, redirigir en la misma ventana
            const div = document.createElement('div');
            div.innerHTML = htmlForm;
            document.body.appendChild(div);
            const form = div.querySelector('form');
            if (form) {
              form.submit();
            }
          }
        },
        error: (err) => {
          console.error('Error al procesar el pago', err);
          alert('Ocurrió un error al procesar tu pago. Por favor intenta nuevamente.');
          this.isProcessingPayment = false;
        },
        complete: () => {
          this.isProcessingPayment = false;
        }
      });
  }

  navigateAnalisis(): void {
    this.router.navigate(['/project-analytics', this.projectId]);
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

  getDaysRemaining(deadline: Date): number {
    return Math.floor((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }

  getTopSupporters(): any[] {
    return [...this.project.supporters]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }
}