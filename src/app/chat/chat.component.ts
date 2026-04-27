import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  userId = 1; // current user
  isTyping = false;
  userName: string = '';

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    const user = this.authService.getUser();
    console.log('Logged in user:', user);
    this.userId = user?.user?.id;
    this.userName = user?.user?.name;

    console.log('Chat component userId:', this.userId, 'userName:', this.userName);
    
    if (!this.userId) {
      console.error('No valid user ID found. Chat will not work properly.');
      return;
    }
    
    this.chatService.startConnection(this.userId);

    // Get users
    this.chatService.users$.subscribe(users => {
      console.log('Users received from SignalR:', users);
      this.users = users;
      console.log('Current users list:', this.users);
      if (!this.activeUser && users.length > 0) {
        console.log('Auto-selecting first user:', users[0]);
        this.selectUser(users[0]);
      } else if (users.length === 0) {
        console.log('No users received yet, waiting for server response...');
      }
    });
  
    // Listen for messages
    this.chatService.messages$.subscribe(msgs => {
      this.messages = msgs.filter(m => m.senderId === this.activeUserId || m.receiverId === this.activeUserId);
      this.scrollToBottom();
    });

    // Listen for typing
    this.chatService.typing$.subscribe(userId => {
      this.isTyping = userId === this.activeUserId;
    });
    console.log(this.activeUser);
    console.log(this.activeUserId);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  selectUser(user: User) {
    this.activeUser = user;
    this.activeUserId = user.id;
    // Optionally, load chat history
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.chatService.sendMessage(this.userId, this.activeUserId, this.newMessage);
    this.newMessage = '';
  }

  sendTyping() {
    this.chatService.sendTyping(this.userId, this.activeUserId);
  }

  private scrollToBottom() {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch { }
  }


}
