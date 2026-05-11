import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../Interface/message';
import { User } from '../Interface/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection!: signalR.HubConnection;

  private messagesSubject = new BehaviorSubject<Message | null>(null);
  messages$ = this.messagesSubject.asObservable();

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private typingSubject = new BehaviorSubject<number | null>(null);
  typing$ = this.typingSubject.asObservable();

  private seenSubject = new BehaviorSubject<number[]>([]);
  seen$ = this.seenSubject.asObservable();

  hubUrl = "http://localhost:5090/chathub";
  apiUrl = "http://localhost:5090/api/Chat";
  constructor(private http: HttpClient) { }

  startConnection(currentUserId: number) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?userId=${currentUserId}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start().then(() => console.log('SignalR connection started'))
      .catch(err => console.error('Error starting SignalR connection: ', err));

    // Listen for messages
    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      this.messagesSubject.next(message);
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

    this.hubConnection.on('MessagesSeen', (messageIds: number[]) => {
      this.seenSubject.next(messageIds);
    });
  }

  sendMessage(senderId: number, receiverId: number, content: string) {
    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      console.error('Hub not connected!');
      return;
    }
    this.hubConnection.invoke('SendMessage', senderId, receiverId, content)
      .catch(err => console.error(err));
  }

  sendTyping(senderId: number, receiverId: number) {
    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) { console.log('Hub not connected!'); return; }
    this.hubConnection.invoke('Typing', senderId, receiverId)
      .catch(err => console.error(err));
  }

  getMessages(senderId: number, receiverId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages?user1=${senderId}&user2=${receiverId}`);
  }

  MessagesSeen(senderId: number, receiverId: number) {

    // console.log('Calling MarkAsSeen:', senderId, receiverId);

  this.hubConnection.invoke('MarkAsSeen', senderId, receiverId)
    .catch(err => console.error(err));
}

}
