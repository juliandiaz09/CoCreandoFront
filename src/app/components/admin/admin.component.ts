import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router'

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  pendingProjects: any[] = [];
  allProjects: any[] = []; // En lugar de pendingProjects
  filteredUsers: any[] = [];
  filteredProjects: any[] = [];
  searchUserTerm = '';
  searchProjectTerm = '';
  selectedUserRole = 'all';
  selectedProjectStatus = 'pending';
  isLoading = true;
  error: string | null = null;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router // Añade esta línea
  ) {}

  ngOnInit(): void {
  if (!this.authService.isAdmin()) {
    this.router.navigate(['/dashboard']);
    return;
  }
  this.loadData();
}

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
        
        this.adminService.getAllProjects().subscribe({
          next: (projects) => {
            this.allProjects = projects;
            this.filteredProjects = [...projects]; // Inicializar con todos los proyectos
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading projects:', err);
            this.error = 'Error al cargar proyectos: ' + this.getErrorMessage(err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Error al cargar usuarios';
        this.isLoading = false;
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 403) {
      return 'Acceso denegado. No tienes permisos de administrador.';
    } else if (error.status === 401) {
      return 'Sesión expirada. Por favor inicia sesión nuevamente.';
    } else {
      return 'Error en el servidor. Intenta nuevamente más tarde.';
    }
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchUserTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(this.searchUserTerm.toLowerCase());
      const matchesRole = this.selectedUserRole === 'all' || user.role === this.selectedUserRole;
      return matchesSearch && matchesRole;
    });
  }

  filterProjects(): void {
    // Filtrar sobre todos los proyectos (allProjects)
    this.filteredProjects = this.allProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(this.searchProjectTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(this.searchProjectTerm.toLowerCase());
      
      // Manejar todos los estados
      const matchesStatus = this.selectedProjectStatus === 'all' || 
                           project.status === this.selectedProjectStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  updateUserRole(userId: string, newRole: string): void {
    this.adminService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.role = newRole;
        }
        this.filterUsers();
      },
      error: (err) => {
        console.error('Error updating user role:', err);
        this.error = 'Error al actualizar rol del usuario: ' + this.getErrorMessage(err);
      }
    });
  }

  banUser(userId: string): void {
    if (confirm('¿Estás seguro de que quieres banear a este usuario?')) {
      this.adminService.banUser(userId).subscribe({
        next: () => {
          const user = this.users.find(u => u.id === userId);
          if (user) {
            user.status = 'banned';
          }
          this.filterUsers();
        },
        error: (err) => {
          console.error('Error banning user:', err);
          this.error = 'Error al banear usuario: ' + this.getErrorMessage(err);
        }
      });
    }
  }
  unbanUser(userId: string): void {
    this.adminService.unbanUser(userId).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.status = 'active';
        }
        this.filterUsers();
      },
      error: (err) => {
        console.error('Error unbanning user:', err);
        this.error = 'Error al desbanear usuario: ' + this.getErrorMessage(err);
      }
    });
  }


  approveProject(projectId: string): void {
    this.adminService.approveProject(projectId).subscribe({
      next: () => {
        // Actualizar el estado localmente
        const projectIndex = this.allProjects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          this.allProjects[projectIndex].status = 'approved';
        }
        this.filterProjects(); // Reaplicar filtros
      },
      error: (err) => {
        console.error('Error approving project:', err);
        this.error = 'Error al aprobar proyecto';
      }
    });
  }

  rejectProject(projectId: string): void {
    this.adminService.rejectProject(projectId).subscribe({
      next: () => {
        // Actualizar el estado localmente
        const projectIndex = this.allProjects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          this.allProjects[projectIndex].status = 'rejected';
        }
        this.filterProjects(); // Reaplicar filtros
      },
      error: (err) => {
        console.error('Error rejecting project:', err);
        this.error = 'Error al rechazar proyecto: ' + this.getErrorMessage(err);
      }
    });
  }
  refreshData(): void {
    this.loadData();
  }
}