import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For ngIf, ngClass
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'; // For reactive forms
import { RouterLink, Router } from '@angular/router'; // For routing
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true, // Mark as standalone
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Import necessary modules
  templateUrl: './register.component.html',
  styleUrls: [],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['student', Validators.required], // Default role
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    this.loading = true;
    const { name, email, password, role } = this.registerForm.value;
    this.authService.register({ name, email, password, role }).subscribe({
      next: (res) => {
        console.log('Registration successful', res);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.msg || 'Registration failed. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
