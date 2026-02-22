import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services/auth.service';

/**
 * LOGIN PAGE
 * Demonstrates Angular Reactive Forms — the Angular equivalent of React Hook Form.
 *
 * React (react-hook-form):
 *   const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
 *   <input {...register('email', { required: true })} />
 *
 * Angular (ReactiveFormsModule):
 *   this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
 *   <input [formControl]="form.controls.email" />
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);

  // FormGroup — Angular's equivalent of react-hook-form's useForm
  readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  // Helper to get individual form controls
  get emailControl(): AbstractControl {
    return this.loginForm.get('email')!;
  }

  get passwordControl(): AbstractControl {
    return this.loginForm.get('password')!;
  }

  // Check if a field has been touched AND has an error
  hasError(controlName: string, errorType: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control?.touched && control?.hasError(errorType));
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Mark all fields as touched to trigger validation display
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.loginError.set(null);

    const { email, password } = this.loginForm.value;

    // Simulate async (in real app, this would be an HTTP call)
    setTimeout(() => {
      const success = this.authService.login(email, password);
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.loginError.set('Invalid credentials. Please try again.');
        this.isSubmitting.set(false);
      }
    }, 800);
  }

  fillDemo(): void {
    this.loginForm.patchValue({
      email: 'demo@angular.dev',
      password: 'angular123',
    });
  }
}
