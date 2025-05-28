import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

export interface Notificacion {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket;
  private notificationsSubject = new BehaviorSubject<Notificacion[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.socket = io("http://localhost:5000"); // Asegúrate de definir esto en environment.ts

    const userId = localStorage.getItem('user_id'); // O de tu auth service
    console.log(userId);

    if (userId) {
      this.socket.emit('join', { user_id: userId });
      this.fetchNotifications(userId);
    }

    this.socket.on('nueva_notificacion', (notif: Notificacion) => {
        console.log('[🔔] Notificación recibida en tiempo real:', notif); // 👈 LOG CLAVE

        const current = this.notificationsSubject.value;
        this.notificationsSubject.next([notif, ...current]);
    });
  }

  fetchNotifications(userId: string) {
    this.socket.emit('obtener_notificaciones', { user_id: userId });

    this.socket.on('lista_notificaciones', (notificaciones: Notificacion[]) => {
      this.notificationsSubject.next(notificaciones);
    });
  }

  marcarComoLeidas(userId: string) {
    this.socket.emit('marcar_como_leidas', { user_id: userId });

    this.socket.on('notificaciones_actualizadas', (actualizadas: Notificacion[]) => {
      const nuevas = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
      this.notificationsSubject.next(nuevas);
    });
  }
}
