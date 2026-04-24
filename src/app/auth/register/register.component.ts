import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  regForm: FormGroup;
  constructor(private fb: FormBuilder, private service: AuthService, private router: Router) {
    this.regForm = this.fb.group({
      name: [''],
      phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      role: ['', Validators.required]
    })
  }
  roles: { name: string }[] = [];
  
  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.service.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error fetching roles', err);
      }
    });
  }

  onSubmit() {
    this.service.register(this.regForm.value).subscribe(() => {
      alert('Registered successfully');
      this.regForm.reset();
      this.router.navigate(['/Login']);
    })
  }
}
