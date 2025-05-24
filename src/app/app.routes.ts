import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard, ProjectCreationGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { RegisterComponent } from './components/register/register.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { ProjectCreationComponent } from './components/project-creation/project-creation.component';
import { ProjectAnalyticsComponent } from './components/project-analytics/project-analytics.component';

export const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent
    // Removemos el AuthGuard para que sea accesible sin login
  },
  { 
    path: 'project/:id', 
    component: ProjectDetailsComponent
  },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [AuthGuard, AdminGuard] 
  },
  { 
    path: 'user-profile', 
    component: UserProfileComponent, 
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'project-creation', 
    component: ProjectCreationComponent,
    canActivate: [AuthGuard, ProjectCreationGuard]
  },
  { 
    path: 'project-analytics/:id', 
    component: ProjectAnalyticsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
]