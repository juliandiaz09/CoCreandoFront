import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
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

 async loadUserProfile(): Promise<void> {
  this.isLoading = true;
  this.error = null;

  try {
    const userStr = localStorage.getItem('custom_user');
    if (!userStr) {
      this.router.navigate(['/login']);
      return;
    }

    const currentUser = JSON.parse(userStr);
    const userId = currentUser.id || currentUser.uid;

    if (!userId) {
      throw new Error('ID de usuario no disponible');
    }

    // Obtener detalles del usuario usando lastValueFrom
    const user$ = this.userService.getCurrentUser(userId).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error loading user:', error);
        if (currentUser) {
          return of({
            ...currentUser,
            role: currentUser.role || 'usuario',
            status: currentUser.status || 'active',
            email_verified: currentUser.email_verified || 'False'
          });
        }
        return throwError(() => error);
      })
    );
    
    this.user = await lastValueFrom(user$);

    // Verificar si es el usuario actual
    this.isCurrentUser = currentUser.email === this.user.email;

    // Obtener proyectos usando lastValueFrom
    const projects$ = this.projectService.getProjects().pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error loading projects:', error);
        return of([]);
      })
    );
    
    const allProjects = await lastValueFrom(projects$);
    this.userProjects = (allProjects || []).filter((project: any) => 
      project.creator && project.creator.email === this.user.email
    );

  } catch (err: any) {
    console.error('Error loading profile:', err);
    this.error = 'Error al cargar el perfil. Por favor intenta nuevamente.';
    if (err.status === 401) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  } finally {
    this.isLoading = false;
  }
}

  navigateToProjectCreation(): void {
    this.router.navigate(['/project-creation']);
  }

  navigateToProjectAnalytics(projectId: string): void {
    this.router.navigate(['/project-analytics', projectId]);
  }
}