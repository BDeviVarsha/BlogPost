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
  loginForm:FormGroup;
  constructor(private fb:FormBuilder, private service:AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.service.login(this.loginForm.value).subscribe(() => {
      alert('Logged in successfully');
      this.router.navigate(['/Home']);
    });
  }

}
