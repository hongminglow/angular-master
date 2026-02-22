import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { inject } from '@angular/core';
import { SectionPageComponent } from '@shared/section-page/section-page.component';
import { ComparisonCardComponent } from '@shared/comparison-card/comparison-card.component';
import { CodeBlockComponent } from '@shared/code-block/code-block.component';

// ===== Custom Validators (Angular equivalent of Zod refinements) =====
function zodLikeEmail(): ValidatorFn {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return (ctrl: AbstractControl): ValidationErrors | null =>
    emailRegex.test(ctrl.value) ? null : { invalidEmail: true };
}

function strongPassword(): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const v: string = ctrl.value ?? '';
    const errors: ValidationErrors = {};
    if (v.length < 8) errors['tooShort'] = true;
    if (!/[A-Z]/.test(v)) errors['noUppercase'] = true;
    if (!/[a-z]/.test(v)) errors['noLowercase'] = true;
    if (!/\d/.test(v)) errors['noNumber'] = true;
    if (!/[^a-zA-Z\d]/.test(v)) errors['noSpecial'] = true;
    return Object.keys(errors).length ? errors : null;
  };
}

function minAge(min: number): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const age = Number(ctrl.value);
    return age >= min ? null : { minAge: { required: min, actual: age } };
  };
}

@Component({
  selector: 'app-schema-validation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SectionPageComponent,
    ComparisonCardComponent,
    CodeBlockComponent,
  ],
  templateUrl: './schema-validation.component.html',
  styleUrl: '../sections.shared.css',
})
export class SchemaValidationComponent {
  private readonly fb = inject(FormBuilder);

  readonly testPassword = signal('');
  readonly form = this.fb.group({
    email: ['', [Validators.required, zodLikeEmail()]],
    password: ['', [Validators.required, strongPassword()]],
    age: [null, [Validators.required, Validators.min(0), minAge(18)]],
  });

  passwordStrength = signal<{ label: string; color: string; score: number }>({
    label: 'None',
    color: '#475569',
    score: 0,
  });

  // Computed booleans used in template (Angular templates don't support /regex/ literals)
  readonly hasUpper = computed(() => /[A-Z]/.test(this.testPassword()));
  readonly hasLower = computed(() => /[a-z]/.test(this.testPassword()));
  readonly hasNumber = computed(() => /\d/.test(this.testPassword()));
  readonly hasSpecial = computed(() => /[^a-zA-Z\d]/.test(this.testPassword()));
  readonly hasMinLength = computed(() => this.testPassword().length >= 8);

  updatePassword(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.testPassword.set(v);
    this.form.patchValue({ password: v });
    this.form.get('password')?.markAsTouched();

    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[a-z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^a-zA-Z\d]/.test(v)) score++;

    const levels = [
      { label: 'Very Weak', color: '#ef4444' },
      { label: 'Weak', color: '#f97316' },
      { label: 'Fair', color: '#eab308' },
      { label: 'Good', color: '#84cc16' },
      { label: 'Strong', color: '#22c55e' },
      { label: 'Very Strong', color: '#10b981' },
    ];
    this.passwordStrength.set({ ...levels[score], score });
  }

  hasError(field: string, error: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.touched && ctrl?.hasError(error));
  }

  // ===== CODE SNIPPETS =====
  readonly zodValidation = `// React — Zod schema validation
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Min 8 chars')
    .regex(/[A-Z]/, 'Need uppercase')
    .regex(/\\d/, 'Need number'),
  age: z.number().min(18, 'Must be 18+'),
  website: z.string().url().optional(),
});

type FormData = z.infer<typeof schema>; // Type auto-inferred!

function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema), // Plug Zod into react-hook-form
  });
  ...
}`;

  readonly angularValidation = `// Angular — Built-in + Custom Validators
import { Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

// Custom validator — equivalent to z.string().regex(...)
function strongPasswordValidator(): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const v = ctrl.value ?? '';
    const errors: ValidationErrors = {};
    if (v.length < 8)      errors['tooShort']    = true;
    if (!/[A-Z]/.test(v))  errors['noUppercase'] = true;
    if (!/\\d/.test(v))    errors['noNumber']    = true;
    return Object.keys(errors).length ? errors : null;
  };
}

// Usage in FormBuilder
form = this.fb.group({
  email:    ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, strongPasswordValidator()]],
  age:      [null, [Validators.required, Validators.min(18)]],
});

// Template error display
// @if (form.get('password')?.hasError('noUppercase')) {
//   <p>Password needs an uppercase letter</p>
// }`;

  readonly yupValidation = `// React — Yup schema (similar to Zod, older)
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string()
    .required()
    .min(8)
    .matches(/[A-Z]/, 'Need uppercase')
    .matches(/\\d/, 'Need number'),
  age: yup.number().required().min(18),
  phone: yup.string().matches(/^\\+?[0-9]{10,}$/, 'Invalid phone'),
}).required();

// Note: Yup is async, Zod is sync — Zod preferred for better TS types`;

  readonly asyncValidatorAngular = `// Angular — Async Validators (for server-side check)
import { AsyncValidatorFn } from '@angular/forms';
import { map, catchError, of } from 'rxjs';

// Async validator — checks if email exists on server
function emailExistsValidator(userService: UserService): AsyncValidatorFn {
  return (ctrl: AbstractControl) =>
    ctrl.value
      ? userService.checkEmailExists(ctrl.value).pipe(
          map(exists => exists ? { emailTaken: true } : null),
          catchError(() => of(null)),
        )
      : of(null);
}

// Usage:
form = this.fb.group({
  email: ['',
    [Validators.required, Validators.email],    // sync validators
    [emailExistsValidator(this.userService)]     // async validators (3rd arg)
  ],
});

// React equivalent with react-hook-form:
// validate: async (v) => { const taken = await checkEmail(v); return taken ? 'Taken' : true; }`;
}
