import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-creation.component.html',
  styleUrls: ['./project-creation.component.scss']
})
export class ProjectCreationComponent {
  projectForm;
  categories = ['Tecnología', 'Social', 'Medio Ambiente', 'Educación', 'Arte'];
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      goal: [0, [Validators.required, Validators.min(100)]],
      category: ['', Validators.required],
      deadline: ['', Validators.required],
      location: [''],
      risksAndChallenges: ['']
    });
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.authService.currentUser$.subscribe(currentUser => {
      if (!currentUser) {
        this.error = 'Debes iniciar sesión para crear un proyecto';
        this.isLoading = false;
        return;
      }

      const projectData = {
        ...this.projectForm.value,
        creator: currentUser,
        collected: 0,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      this.projectService.createProject(projectData).subscribe({
        next: () => {
          this.router.navigate(['/user-profile']);
        },
        error: (err) => {
          console.error('Error creating project', err);
          this.error = 'Error al crear el proyecto. Por favor intenta nuevamente.';
          this.isLoading = false;
        }
      });
    });
  }
}