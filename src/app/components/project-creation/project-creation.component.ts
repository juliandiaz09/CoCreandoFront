import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';

interface ProjectCreationResponse {
  projectId?: string;
  mensaje?: string;
  [key: string]: any;
}
interface CurrentUser {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  [key: string]: any; // Para otras propiedades que pueda tener
}

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
      longDescription: ['', [Validators.required, Validators.minLength(100)]],
      goal: [0, [Validators.required, Validators.min(100)]],
      category: ['', Validators.required],
      deadline: ['', Validators.required],
      location: ['', Validators.required],
      risksAndChallenges: ['', Validators.required],
      rewards: this.fb.array([this.createReward()]),
      updates: this.fb.array([this.createUpdate()])
    });
  }

  
  get rewards(): FormArray {
    return this.projectForm.get('rewards') as FormArray;
  }

  get updates(): FormArray {
    return this.projectForm.get('updates') as FormArray;
  }

  createReward() {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      minimumAmount: [0, [Validators.required, Validators.min(1)]]
    });
  }

  createUpdate() {
    return this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0]]
    });
  }

  addReward() {
    this.rewards.push(this.createReward());
  }

  removeReward(index: number) {
    this.rewards.removeAt(index);
  }

  addUpdate() {
    this.updates.push(this.createUpdate());
  }

  removeUpdate(index: number) {
    this.updates.removeAt(index);
  }


 onSubmit() {
  if (this.projectForm.invalid || this.isLoading) {
    return; // Evita múltiples envíos
  }

  this.isLoading = true;
  this.error = null;

  this.authService.currentUser$.pipe(
    take(1)
  ).subscribe((currentUser: CurrentUser | null) => {
    if (!currentUser) {
      this.error = 'Debes iniciar sesión para crear un proyecto';
      this.isLoading = false;
      return;
    }

    // Verificar y formatear la fecha deadline
    const deadlineValue = this.projectForm.get('deadline')?.value;
    if (!deadlineValue) {
      this.error = 'La fecha límite es requerida';
      this.isLoading = false;
      return;
    }
    const formattedDeadline = new Date(deadlineValue).toISOString();

    // Verificar y formatear las actualizaciones
    const updatesValue = this.projectForm.get('updates')?.value;
    const formattedUpdates = updatesValue ? 
      updatesValue.map((update: any) => ({
        ...update,
        date: update.date ? new Date(update.date).toISOString() : new Date().toISOString()
      })) : [];

    const projectData = {
      ...this.projectForm.value,
      deadline: formattedDeadline,
      updates: formattedUpdates,
      creator: {
        name: currentUser.name,
        email: currentUser.email,
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'
      },
      collected: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      supporters: []
    };

    this.projectService.createProject(projectData).pipe(
      take(1)
    ).subscribe({
      next: (res: any) => {
        this.projectForm.reset();
        const projectId = res?.projectId || '';
        if (projectId) {
          this.router.navigate(['/project', projectId], {
            replaceUrl: true
          });
        } else {
          this.router.navigate(['/user-profile']);
        }
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