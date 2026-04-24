import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Message } from './message';
import { User } from './user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // messages: Message[] = [];
  // newMessage = '';
  // userId = 1; // logged-in user
  // receiverId = 2; // chat partner
  // constructor(private chatService: ChatService) { }

  // ngOnInit(): void {
  //   this.chatService.startConnection(this.userId);
  //   this.chatService.messages$.subscribe(messages => {
  //     this.messages = messages;
  //   });
  // }

  // sendMessage() {
  //   if (!this.newMessage.trim()) return;

  //   this.chatService.sendMessage(this.userId, this.receiverId, this.newMessage);
  //   this.newMessage = '';
  // }

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  users: User[] = [];
  activeUser!: User;
  activeUserId!: number;
  messages: Message[] = [];
  newMessage = '';
  userId = 1; // current user
  isTyping = false;

  constructor(private signalRService: ChatService) { }

  ngOnInit() {
    this.signalRService.startConnection(this.userId);

    // Get users
    this.signalRService.users$.subscribe(users => {
      this.users = users;
      if (!this.activeUser && users.length > 0) {   // ✅ check length
        this.selectUser(users[0]);
      }
    });

    // Listen for messages
    this.signalRService.messages$.subscribe(msgs => {
      this.messages = msgs.filter(m => m.senderId === this.activeUserId || m.receiverId === this.activeUserId);
      this.scrollToBottom();
    });

    // Listen for typing
    this.signalRService.typing$.subscribe(userId => {
      this.isTyping = userId === this.activeUserId;
    });
    console.log(this.activeUser);
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
    this.signalRService.sendMessage(this.userId, this.activeUserId, this.newMessage);
    this.newMessage = '';
  }

  sendTyping() {
    this.signalRService.sendTyping(this.userId, this.activeUserId);
  }

  private scrollToBottom() {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch { }
  }
}
