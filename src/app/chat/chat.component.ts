import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Message } from './message';
import { User } from './user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  users: User[] = [];
  activeUser!: User;
  activeUserId!: number;
  messages: Message[] = [];
  newMessage = '';
  userId!: number; // current user
  isTyping = false;
  userName: string = '';

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    const user = this.authService.getUser();
    console.log('Logged in user:', user);
    this.userId = user.id;
    this.userName = user.name;
    if (!this.userId) {
      console.error('No valid user ID found. Chat will not work properly.');
      return;
    }
    
    this.chatService.startConnection(this.userId);

    // Get users
    this.chatService.users$.subscribe(users => {
      this.users = users;
    });
  
    // Listen for messages
    this.chatService.messages$.subscribe(msg => {
      if (msg && (msg.senderId === this.activeUserId || msg.receiverId === this.activeUserId)) {
        this.messages.push(msg);
        this.scrollToBottom();
      }
    });

    // Listen for typing
    this.chatService.typing$.subscribe(userId => {
      this.isTyping = userId === this.activeUserId;
    });

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  selectUser(user: User) {
    this.activeUser = user;
    this.activeUserId = user.id;
    // Load chat history
    this.messages = []; // Clear previous
    this.chatService.getMessages(this.userId, this.activeUserId).subscribe(history => {
      this.messages = history;
      console.log('Chat history with', this.activeUser.name, history);
      this.scrollToBottom();
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.chatService.sendMessage(this.userId, this.activeUserId, this.newMessage);
    this.newMessage = '';
    console.log(this.userId, this.activeUserId, this.newMessage);
  }

  sendTyping() {
    this.chatService.sendTyping(this.userId, this.activeUserId);
  }

  isMyMessage(msg: Message): boolean {
    return msg.senderId === this.userId;
  }

  private scrollToBottom() {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch { }
  }
}
