import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../chat/message';
import { User } from '../chat/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection!: signalR.HubConnection;

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private typingSubject = new BehaviorSubject<number | null>(null);
  typing$ = this.typingSubject.asObservable();
  hubUrl = "https://localhost:7249/chathub";
  constructor(private http: HttpClient) { }

  startConnection(currentUserId: number) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?userId=${currentUserId}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.error('Error starting SignalR connection: ', err));

    // Listen for messages
    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      const current = this.messagesSubject.getValue();
      this.messagesSubject.next([...current, message]);
    });

    // Listen for users list
    this.hubConnection.on('ReceiveUsers', (users: User[]) => {
      this.usersSubject.next(users);
    });

    // Listen for typing notifications
    this.hubConnection.on('UserTyping', (userId: number) => {
      this.typingSubject.next(userId);
      setTimeout(() => this.typingSubject.next(null), 2000); // hide after 2s
    });
  }

  sendMessage(senderId: number, receiverId: number, content: string) {
    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.error('Hub not connected!');
      return;
    }
    this.hubConnection.invoke('SendMessage',  senderId, receiverId, content )
      .catch(err => console.error(err));
  }

  sendTyping(senderId: number, receiverId: number) {
    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {console.log('Hub not connected!'); return;}
    this.hubConnection.invoke('Typing', senderId, receiverId )
      .catch(err => console.error(err));
  }
}
