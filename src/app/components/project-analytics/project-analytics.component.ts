import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

interface AnalyticsData {
  basicStats: {
    totalCollected: number;
    percentageFunded: number;
    daysRemaining: number;
    supportersCount: number;
    rewardsClaimed: number;
  };
  supporters: {
    name: string;
    amount: number;
    date: string;
    reward?: string;
  }[];
  fundingProgress: {
    date: string;
    amount: number;
  }[];
  rewardsDistribution: {
    reward: string;
    count: number;
    totalAmount: number;
  }[];
  recentActivity: {
    type: string;
    description: string;
    date: string;
  }[];
}
interface ActivityItem {
  type: 'update' | 'support';
  description: string;
  date: string;
}


@Component({
  selector: 'app-project-analytics',
  templateUrl: './project-analytics.component.html',
  styleUrls: ['./project-analytics.component.scss'],
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],
  providers: [DecimalPipe, DatePipe]
})
export class ProjectAnalyticsComponent implements OnInit {
  projectId: string = '';
  project: any | null = null;
  analyticsData: AnalyticsData | null = null;
  isLoading = true;
  error: string | null = null;
  currentUserEmail: string = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private authService: AuthService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.authService.currentUser$.subscribe(user => {
      this.currentUserEmail = user?.email || '';
      this.loadProjectData();
    });
  }

  loadProjectData(): void {
    this.isLoading = true;
    
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project) => {
        if (!project) {
          this.error = 'Proyecto no encontrado';
          this.isLoading = false;
          return;
        }
        
        this.project = project;
        
        this.generateAnalytics(project);
      },
      error: (err) => {
        console.error('Error loading project', err);
        this.error = 'Error al cargar el proyecto';
        this.isLoading = false;
      }
    });
  }

  generateAnalytics(project: any): void {
    // 1. Estadísticas básicas
    const totalCollected = project.collected || 0;
    const percentageFunded = Math.min(Math.round((totalCollected / project.goal) * 100), 100);
    
    const deadline = new Date(project.deadline);
    const today = new Date();
    const daysRemaining = Math.max(0, Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    // 2. Datos de apoyos
    const supporters = project.supporters?.map((sup: any) => ({
      name: sup.name,
      amount: sup.amount,
      date: new Date(sup.date).toLocaleDateString(),
      reward: this.getRewardName(project.rewards, sup.amount)
    })) || [];
    
    // 3. Progreso de financiación (simulado)
    const fundingProgress = this.generateFundingProgress(project);
    
    // 4. Distribución de recompensas
    const rewardsDistribution = this.calculateRewardsDistribution(project);
    
    // 5. Actividad reciente
    const recentActivity = this.generateRecentActivity(project);
    
    this.analyticsData = {
      basicStats: {
        totalCollected,
        percentageFunded,
        daysRemaining,
        supportersCount: supporters.length,
        rewardsClaimed: rewardsDistribution.reduce((acc, curr) => acc + curr.count, 0)
      },
      supporters,
      fundingProgress,
      rewardsDistribution,
      recentActivity
    };
    
    this.isLoading = false;
  }

  navigateToEdit(): void {
  this.router.navigate(['/project-edit', this.projectId]);
}

  private getRewardName(rewards: any[], amount: number): string {
    if (!rewards) return 'Sin recompensa';
    const eligibleRewards = rewards
      .filter(r => amount >= r.minimumAmount)
      .sort((a, b) => b.minimumAmount - a.minimumAmount);
    return eligibleRewards[0]?.title || 'Sin recompensa';
  }

  private generateFundingProgress(project: any): any[] {
    // Simulamos datos de progreso si no existen
    if (project.fundingProgress) return project.fundingProgress;
    
    const progress = [];
    const startDate = new Date(project.createdAt);
    const today = new Date();
    const totalDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let currentAmount = 0;
    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Simular crecimiento (podrías reemplazar con datos reales)
      currentAmount += Math.random() * (project.goal / 10);
      if (currentAmount > project.collected) currentAmount = project.collected;
      
      progress.push({
        date: date.toISOString().split('T')[0],
        amount: Math.round(currentAmount)
      });
    }
    
    return progress;
  }

  private calculateRewardsDistribution(project: any): any[] {
    if (!project.rewards || !project.supporters) return [];
    
    return project.rewards.map((reward: any) => {
      const supportersForReward = project.supporters.filter(
        (sup: any) => sup.amount >= reward.minimumAmount
      );
      
      return {
        reward: reward.title,
        count: supportersForReward.length,
        totalAmount: supportersForReward.reduce((sum: number, sup: any) => sum + sup.amount, 0)
      };
    });
  }

 private generateRecentActivity(project: any): ActivityItem[] {
  const activity: ActivityItem[] = [];
  
  // Agregar actualizaciones del proyecto
  if (project.updates) {
    project.updates.forEach((update: any) => {
      activity.push({
        type: 'update',
        description: update.title,
        date: update.date
      });
    });
  }
  
  // Agregar apoyos recientes
  if (project.supporters) {
    project.supporters.slice(-5).forEach((sup: any) => {
      activity.push({
        type: 'support',
        description: `Nuevo apoyo de ${sup.name} ($${sup.amount})`,
        date: sup.date
      });
    });
  }
  
  // Ordenar por fecha (más reciente primero)
  return activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
}