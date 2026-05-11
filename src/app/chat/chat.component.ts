import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Message } from '../Interface/message';
import { User } from '../Interface/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('messageContainers') private messageContainer!: ElementRef;

  users: User[] = [];
  activeUser!: User;
  activeUserId!: number;
  messages: Message[] = [];
  newMessage = '';
  userId!: number;
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
      if (msg && ((msg.sender_Id === this.activeUserId && msg.receiver_Id === this.userId) || (msg.sender_Id === this.userId && msg.receiver_Id === this.activeUserId))) {
        this.messages.push(msg);
        this.scrollToBottom();
      }
    });

    // Listen for typing
    this.chatService.typing$.subscribe(userId => {
      this.isTyping = userId === this.activeUserId;
    });

    this.chatService.seen$.subscribe(ids => {
      if (!ids) {
        // console.warn('Received null or undefined message IDs in seen$');
        return;
      }

      ids.forEach(id => {
        const msg = this.messages.find(m => m.id === id);
        // console.log('Marking message as seen:', id, msg);
        if (msg) msg.seen = true;
      });
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
      // this.scrollToBottom();

      this.chatService.MessagesSeen(this.activeUserId, this.userId);
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    const msg: Message = {
      id: 0, // will be set by backend
      sender_Id: this.userId,
      receiver_Id: this.activeUserId,
      content: this.newMessage,
      timestamp: new Date(),
      seen: false
    };
    this.messages.push(msg);
    // this.scrollToBottom();
    this.chatService.sendMessage(this.userId, this.activeUserId, this.newMessage);
    this.newMessage = '';
  }

  sendTyping() {
    console.log('Sending typing notification');
    this.chatService.sendTyping(this.userId, this.activeUserId);
  }

  markAsSeen(message: Message) {
    if (!message.seen && message.receiver_Id === this.userId) {

      this.chatService.MessagesSeen(message.id, message.sender_Id);
      message.seen = true; // Optimistically update UI
    }
  }

  private scrollToBottom() {
    try {
      if (this.messageContainer && this.messageContainer.nativeElement) {
        this.messageContainer.nativeElement!.scrollTop = this.messageContainer.nativeElement!.scrollHeight;
      }
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }
}
