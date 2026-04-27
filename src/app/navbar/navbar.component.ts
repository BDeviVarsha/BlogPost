import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../chat/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn = false;
  user: User | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // console.log('Navbar initialized. Logged in status:', this.isLoggedIn);
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.user = status ? this.authService.getUser() : null;
      // console.log('Navbar auth status:', status, 'user:', this.user);
    });
    // console.log('Navbar initialized. Logged in status:', this.isLoggedIn);
    this.authService.checkLoginStatus();
    this.user = this.authService.getUser();
    console.log('User name:', this.user?.name);
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
        // console.error('Logout error', err);
        alert('Logout failed, please try again');
        this.router.navigate(['/Login']);
      }
    });
  }

}
