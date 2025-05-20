import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'CoCreando';
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    //this.authService.logout();
    this.router.navigate(['/dashboard']); // Redirige al dashboard después de logout
  }
}