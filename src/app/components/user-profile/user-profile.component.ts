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
  showChangePassword = false;
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordChangeError: string | null = null;
  passwordChangeSuccess = false

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) { }

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

  async deleteAccount(): Promise<void> {
    if (this.userProjects.length > 0) {
      alert('No puedes eliminar tu cuenta porque tienes proyectos creados.');
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        await this.userService.deleteAccount(this.user.id).toPromise();
        this.authService.logout();
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        this.error = 'Error al eliminar la cuenta. Por favor intenta nuevamente.';
      }
    }
  }

  async changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    // Resetear estados
    this.passwordChangeError = null;
    this.passwordChangeSuccess = false;

    // Validaciones básicas
    if (!oldPassword || !newPassword || !confirmPassword) {
      this.passwordChangeError = 'Todos los campos son obligatorios';
      return;
    }

    if (newPassword !== confirmPassword) {
      this.passwordChangeError = 'Las contraseñas nuevas no coinciden';
      return;
    }

    if (newPassword.length < 6) {
      this.passwordChangeError = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    try {
      await lastValueFrom(
        this.authService.changePassword(oldPassword, newPassword).pipe(
          catchError(error => {
            // Capturamos el error del servicio
            console.error('Error changing password:', error);
            throw error; // Re-lanzamos para manejarlo en el catch
          })
        )
      );

      // Éxito
      this.passwordChangeSuccess = true;
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';

      // Ocultar formulario después de 2 segundos
      setTimeout(() => {
        this.showChangePassword = false;
      }, 2000);

    } catch (error: any) {
      console.error('Error en changePassword:', error);
      this.passwordChangeError = error.message || 'Revisa los campos ingresados o no es la contraseña actual o la contraseña nueba debe tener: -una letra -un numero - un caracter';

      // Manejo específico para sesión antigua
      if (error.message.includes('antigua')) {
        this.passwordChangeError += '. Redirigiendo a login...';
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 3000);
      }
    }
  }
}