import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatMessage } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);
  public message$: Observable<ChatMessage | null> = this.messageSubject.asObservable();

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalRUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message: ChatMessage) => {
      this.messageSubject.next(message);
    });

    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch((err) => console.error('SignalR Connection Error: ', err));
  }

  public sendMessage(message: string, sessionId: string): Promise<void> {
    return this.hubConnection.invoke('SendMessage', message, sessionId);
  }

  public disconnect(): void {
    this.hubConnection.stop();
  }
}
