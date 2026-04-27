import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      role: ['', Validators.required]
    });
  }
  roles: { name: string }[] = [];

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.authService.getRoles().subscribe(
      (data) => {
        this.roles = data;
      },
      (err) => {
        console.error('Error fetching roles', err);
      }
    );
  }

  onSubmit() {

    this.authService.login(this.loginForm.value).subscribe({
      next: (user: any) => {

        if (!user) {
          alert('Invalid credentials');
          return;
        }

        this.authService.loginSuccess(user);

        alert('Logged in successfully');
        this.router.navigate(['/Home']);
      },

      error: (err: any) => {
        console.error(err);
        alert('Invalid credentials');
      }
    });

  }

  // onLogout() {
  //   this.authService.logout();
  //   alert('Logged out successfully');
  //   this.router.navigate(['/login']);
  // }
}
