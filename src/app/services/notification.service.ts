import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

export interface Notificacion {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  date: Date;
  read: boolean;
  link?: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private socket: Socket;
  private notificationsSubject = new BehaviorSubject<Notificacion[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private userId: string | null = null;

constructor() {
  this.userId = localStorage.getItem('user_id');
  this.socket = io("https://cocreandoback.onrender.com", {
    transports: ['websocket'],
    autoConnect: true,
    reconnectionAttempts: 3
  });
  
  this.cleanupSocketListeners();
  this.setupBaseListeners();

  
  if (this.userId) {
    this.joinUserRoom();

    this.socket.on('confirmacion_join', (data: {room: string, socket_id: string}) => {
        
    });


    this.socket.on('connect', () => {
    });

    this.socket.on('join_error', (error: string) => {
        console.error('❌ Error al unirse a la sala:', error);
    });
    this.cargarNotificaciones();
  }
}


  private cleanupSocketListeners(): void {
    // Eliminar todos los listeners existentes
    this.socket.off('connect');
    this.socket.off('nueva_notificacion');
    this.socket.off('lista_notificaciones');
    this.socket.off('notificaciones_actualizadas');
  }

  private setupBaseListeners(): void {
    // Listener para nuevas notificaciones
    this.socket.on('nueva_notificacion', (notif: Notificacion) => {
      this.handleNewNotification(notif);
    });

    // Listener para reconexión
    this.socket.on('connect', () => {
      if (this.userId) {
        this.joinUserRoom();
      }
    });
  }

  private joinUserRoom(): void {
    this.socket.emit('join', { user_id: this.userId });
  }

  private handleNewNotification(notif: Notificacion): void {
    const notificationWithDate = {
      ...notif,
      date: notif.date ? new Date(notif.date) : new Date(notif.timestamp)
    };
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([notificationWithDate, ...current]);
  }

  cargarNotificaciones(): void {
    if (!this.userId) return;

    // Limpiar listener antiguo para evitar duplicados
    this.socket.off('lista_notificaciones');
    
    this.socket.emit('obtener_notificaciones', { user_id: this.userId });

    this.socket.on('lista_notificaciones', (notificaciones: Notificacion[]) => {
      const notifsWithDates = notificaciones
        .filter(notif => notif.user_id === this.userId) // Filtro por user_id
        .map(notif => ({
          ...notif,
          date: notif.date ? new Date(notif.date) : new Date(notif.timestamp)
        }));

      this.notificationsSubject.next(notifsWithDates);
    });
  }

  marcarComoLeidas(): void {
    if (!this.userId) return;

    // Limpiar listener antiguo
    this.socket.off('notificaciones_actualizadas');
    
    this.socket.emit('marcar_como_leidas', { user_id: this.userId });

    this.socket.on('notificaciones_actualizadas', (actualizadas: Notificacion[]) => {
      const nuevas = actualizadas.map(notif => ({
        ...notif,
        date: notif.date ? new Date(notif.date) : new Date(notif.timestamp),
        read: true
      }));
      this.notificationsSubject.next(nuevas);
    });
  }

  marcarComoLeida(notificationId: string): void {
    if (!this.userId) return;

    this.socket.emit('marcar_como_leida', { 
      user_id: this.userId, 
      notification_id: notificationId 
    });

    const current = this.notificationsSubject.value.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    this.notificationsSubject.next(current);
  }

  ngOnDestroy(): void {
    // Limpiar todos los listeners y desconectar
    this.cleanupSocketListeners();
    this.socket.disconnect();
  }
}