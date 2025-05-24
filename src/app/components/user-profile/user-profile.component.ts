import { Component, NgModule, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  imports: [NgIf] 
})



export class UserProfileComponent implements OnInit {
  user: any = null;
  userProjects: any[] = [];
  isLoading = true;
  error: string | null = null;
  isCurrentUser = false;

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.error = null;

    // Obtener el usuario actual
    this.authService.currentUser$.subscribe(currentUser => {
      const userStr = localStorage.getItem("custom_user");
      console.log(userStr)

      if (!userStr) {
        this.router.navigate(['/login']);
        return;
      }

      const parsedUser = JSON.parse(userStr);
      const userId = parsedUser.id;
      
      // Obtener detalles del usuario
      this.userService.getCurrentUser(userId).subscribe({
        next: (userData) => {
          this.user = userData;
          
          // Obtener proyectos del usuario si es creador
          this.projectService.getProjects().subscribe({
            next: (projects) => {
              this.userProjects = projects.filter((p: any) => 
                p.creator?.email === this.user.email
              );
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error loading projects', err);
              this.isLoading = false;
            }
          });
        },
        error: (err) => {
          console.error('Error loading user', err);
          this.error = 'Error al cargar el perfil';
          this.isLoading = false;
        }
      });
    });
  }

  navigateToProjectCreation(): void {
    this.router.navigate(['/project-creation']);
  }

  navigateToProjectAnalytics(projectId: string): void {
    this.router.navigate(['/project-analytics', projectId]);
  }
}