// project-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ProjectEditComponent implements OnInit {
  projectId: string = '';
  projectForm: FormGroup;
  isLoading = true; // Cambiado a true para indicar carga inicial
  error: string | null = null;
  categories = ['Tecnología', 'Social', 'Medio Ambiente', 'Educación', 'Arte'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private authService: AuthService
  ) {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      longDescription: ['', [Validators.required, Validators.minLength(100)]],
      category: ['', Validators.required],
      location: ['', Validators.required],
      risksAndChallenges: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    this.loadProjectData();
  }

  loadProjectData(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(currentUser => {
      this.projectService.getProjectById(this.projectId).subscribe({
        next: (project) => {
          if (!project) {
            this.error = 'Proyecto no encontrado';
            this.isLoading = false;
            return;
          }

          // Verificar que el usuario actual es el creador
          if (project.creator?.email !== currentUser?.email) {
            this.error = 'No tienes permiso para editar este proyecto';
            this.isLoading = false;
            return;
          }

          // Rellenar el formulario con los datos actuales
          this.projectForm.patchValue({
            title: project.title,
            description: project.description,
            longDescription: project.longDescription || '',
            category: project.category,
            location: project.location || '',
            risksAndChallenges: project.risksAndChallenges || ''
          });

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading project', err);
          this.error = 'Error al cargar el proyecto';
          this.isLoading = false;
        }
      });
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const updatedData = {
      ...this.projectForm.value
    };

    this.projectService.updateProject(this.projectId, updatedData).subscribe({
      next: () => {
        this.router.navigate(['/project-analytics', this.projectId]);
      },
      error: (err) => {
        console.error('Error updating project', err);
        this.error = 'Error al actualizar el proyecto';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/project-analytics', this.projectId]);
  }
}