import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

// Custom validator — Angular equivalent of Zod/Yup refinements
export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-forms',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SectionPageComponent,
    ComparisonCardComponent,
    CodeBlockComponent,
  ],
  templateUrl: './forms.component.html',
  styleUrl: '../sections.shared.css',
})
export class FormsComponent {
  private readonly fb = inject(FormBuilder);

  readonly submitted = signal(false);
  readonly submittedData = signal<Record<string, unknown> | null>(null);

  // Reactive Form with custom validators
  readonly registrationForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(120)]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Z])(?=.*\d)/)],
      ],
      confirmPassword: ['', Validators.required],
      role: ['user', Validators.required],
      terms: [false, Validators.requiredTrue],
    },
    { validators: passwordMatchValidator() },
  );

  hasError(field: string, error: string): boolean {
    const ctrl = this.registrationForm.get(field);
    return !!(ctrl?.touched && ctrl?.hasError(error));
  }

  hasGroupError(error: string): boolean {
    return !!(this.registrationForm.touched && this.registrationForm.hasError(error));
  }

  onSubmit(): void {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.valid) {
      const { confirmPassword: _, ...data } = this.registrationForm.value;
      this.submittedData.set(data);
      this.submitted.set(true);
    }
  }

  resetForm(): void {
    this.registrationForm.reset({ role: 'user', terms: false });
    this.submitted.set(false);
    this.submittedData.set(null);
  }

  // ===== CODE =====
  readonly reactHookForm = `// React — react-hook-form
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          required: 'Email required',
          pattern: { value: /\S+@\S+/, message: 'Invalid email' }
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register('password', { required: true, minLength: 8 })}
      />
      <button type="submit">Submit</button>
    </form>
  );
}`;

  readonly angularReactiveForm = `// Angular — Reactive Forms (FormBuilder)
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule], // Required in standalone components
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" />
      @if (form.get('email')?.touched && form.get('email')?.hasError('required')) {
        <p>Email is required</p>
      }
      <input type="password" formControlName="password" />
      <button type="submit">Submit</button>
    </form>
  \`
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}`;

  readonly customValidatorAngular = `// Angular — Custom Validators (equivalent to Zod refinements)
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

// Standalone validator function
export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pw  = group.get('password')?.value;
    const cpw = group.get('confirm')?.value;
    return pw === cpw ? null : { mismatch: true };
  };
}

// Field-level custom validator
export function noSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return /\s/.test(control.value) ? { noSpaces: true } : null;
  };
}

// Usage:
this.fb.group(
  {
    username: ['', [Validators.required, noSpacesValidator()]],
    password: ['', Validators.required],
    confirm: ['', Validators.required],
  },
  { validators: passwordMatchValidator() } // Group-level validator
);`;

  readonly templateDrivenAngular = `// Angular — Template-Driven Forms (simpler, NgModel-based)
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: \`
    <form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">
      <input
        name="email"
        [(ngModel)]="email"
        required
        email
        #emailField="ngModel"
      />
      @if (emailField.invalid && emailField.touched) {
        <p>Invalid email</p>
      }
      <button [disabled]="myForm.invalid">Submit</button>
    </form>
  \`
})
export class SimpleFormComponent {
  email = '';

  onSubmit(form: NgForm) {
    if (form.valid) console.log(form.value);
  }
}
// Note: Template-driven ≈ Formik, Reactive forms ≈ react-hook-form`;
}
