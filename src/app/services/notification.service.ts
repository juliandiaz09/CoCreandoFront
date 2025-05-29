import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

export interface Notificacion {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  date: Date;        // Cambiado a obligatorio
  read: boolean;
  link?: string;     // Para navegación
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

    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.socket.emit('join', { user_id: userId });
      this.cargarNotificaciones(userId); // Cambio de nombre para consistencia
    }

    this.socket.on('nueva_notificacion', (notif: Notificacion) => {
      const notificationWithDate = {
        ...notif,
        date: notif.date ? new Date(notif.date) : new Date(notif.timestamp)
      };
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([notificationWithDate, ...current]);
    });
  }

  cargarNotificaciones(userId: string) {
    this.socket.emit('obtener_notificaciones', { user_id: userId });

    this.socket.on('lista_notificaciones', (notificaciones: Notificacion[]) => {
      const notifsWithDates = notificaciones.map(notif => ({
        ...notif,
        date: notif.date ? new Date(notif.date) : new Date(notif.timestamp)
      }));
      this.notificationsSubject.next(notifsWithDates);
    });
  }

  marcarComoLeidas(userId: string) {
    this.socket.emit('marcar_como_leidas', { user_id: userId });

    this.socket.on('notificaciones_actualizadas', (actualizadas: Notificacion[]) => {
      const nuevas = actualizadas.map(notif => ({
        ...notif,
        date: notif.date ? new Date(notif.date) : new Date(notif.timestamp),
        read: true
      }));
      this.notificationsSubject.next(nuevas);
    });
  }

  marcarComoLeida(userId: string, notificationId: string) {
    this.socket.emit('marcar_como_leida', { 
      user_id: userId, 
      notification_id: notificationId 
    });

    const current = this.notificationsSubject.value.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    this.notificationsSubject.next(current);
  }
}