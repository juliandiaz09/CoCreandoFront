import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userDisplay',
  standalone: true
})
export class UserDisplayPipe implements PipeTransform {
  transform(user: any): string {
    if (!user) return 'Usuario';
    
    // Prioridad: name -> email (sin dominio) -> 'Usuario'
    return user?.name || user?.email?.split('@')[0] || 'Usuario';
  }
}