import { Component, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../Interface/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn = false;
  user: User | null = null;
  isOpen = false;

  constructor(private authService: AuthService, private router: Router, private elRef: ElementRef) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.user = status ? this.authService.getUser() : null;
    });
    this.authService.checkLoginStatus();
    this.user = this.authService.getUser();
    console.log('User name:', this.user?.name);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    // If the clicked element is NOT inside this component, close it
    if (!this.elRef.nativeElement.contains(event.target)) {
      // console.log(event.target);
      // console.log(this.elRef)
      this.isOpen = false;
    }
  }

  getUser() {
    return this.user;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        alert('Logged out successfully');
        this.router.navigate(['/Login']);
      },
      error: (err) => {
        console.error('Logout error', err);
        alert('Logout failed, please try again');
        this.router.navigate(['/Login']);
      }
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
