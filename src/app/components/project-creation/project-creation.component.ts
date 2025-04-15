// project-creation.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.component.html',
  styleUrls: ['./project-creation.component.scss']
})
export class ProjectCreationComponent {
  project = {
    title: '',
    description: '',
    goal: 0,
    category: '',
    deadline: ''
  };

  categories = ['Tecnología', 'Social', 'Medio Ambiente', 'Educación', 'Arte'];

  submitProject() {
    // Lógica para enviar el proyecto
    console.log('Proyecto enviado:', this.project);
  }
}