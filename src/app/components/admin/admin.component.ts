import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

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
        
        this.adminService.getPendingProjects().subscribe({
          next: (projects) => {
            this.pendingProjects = projects;
            this.filteredProjects = [...projects];
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading projects:', err);
            this.error = 'Error al cargar proyectos';
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

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchUserTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(this.searchUserTerm.toLowerCase());
      const matchesRole = this.selectedUserRole === 'all' || user.rol === this.selectedUserRole;
      return matchesSearch && matchesRole;
    });
  }

  filterProjects(): void {
    this.filteredProjects = this.pendingProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(this.searchProjectTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(this.searchProjectTerm.toLowerCase());
      const matchesStatus = this.selectedProjectStatus === 'all' || project.status === this.selectedProjectStatus;
      return matchesSearch && matchesStatus;
    });
  }

  updateUserRole(userId: string, newRole: string): void {
    this.adminService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.rol = newRole;
        }
        this.filterUsers();
      },
      error: (err) => {
        console.error('Error updating user role:', err);
        this.error = 'Error al actualizar rol del usuario';
      }
    });
  }

  banUser(userId: string): void {
    if (confirm('¿Estás seguro de que quieres banear a este usuario?')) {
      this.adminService.banUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
          this.filterUsers();
        },
        error: (err) => {
          console.error('Error banning user:', err);
          this.error = 'Error al banear usuario';
        }
      });
    }
  }

  approveProject(projectId: string): void {
    this.adminService.approveProject(projectId).subscribe({
      next: () => {
        this.pendingProjects = this.pendingProjects.filter(p => p.id !== projectId);
        this.filterProjects();
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
        this.pendingProjects = this.pendingProjects.filter(p => p.id !== projectId);
        this.filterProjects();
      },
      error: (err) => {
        console.error('Error rejecting project:', err);
        this.error = 'Error al rechazar proyecto';
      }
    });
  }

  refreshData(): void {
    this.loadData();
  }
}