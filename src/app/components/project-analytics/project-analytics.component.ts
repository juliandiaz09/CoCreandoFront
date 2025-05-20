import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-analytics',
  templateUrl: './project-analytics.component.html',
  styleUrls: ['./project-analytics.component.scss']
})
export class ProjectAnalyticsComponent implements OnInit {
  projectId: string = '';
  analyticsData: any = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.isLoading = true;
    this.error = null;

    this.projectService.getProjectAnalytics(this.projectId).subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading analytics', err);
        this.error = 'Error al cargar los análisis del proyecto';
        this.isLoading = false;
      }
    });
  }
}