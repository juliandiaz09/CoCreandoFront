import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { 
    path: 'dashboard', 
    component: DashboardComponent
    // Removemos el AuthGuard para que sea accesible sin login
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
    path: '**', 
    redirectTo: '/dashboard' 
  }
]