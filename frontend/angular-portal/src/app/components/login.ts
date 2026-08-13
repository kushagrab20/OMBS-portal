import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container d-flex align-items-center justify-content-center py-5" style="min-height: 80vh;">
      <div class="card border-0 shadow-lg rounded-4 p-4 p-sm-5 w-100" style="max-width: 480px;">
        <div class="text-center mb-4">
          <i class="bi bi-shield-lock text-primary display-4 mb-2 d-inline-block"></i>
          <h2 class="fw-bold mb-1">Welcome Back</h2>
          <p class="text-muted small">Access your Online Maid Bureau account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <!-- General Error Message -->
          <div class="alert alert-danger rounded-3 p-3 small border-0 mb-3 d-flex align-items-center" *ngIf="errorMessage">
            <i class="bi bi-exclamation-triangle-fill fs-5 me-2"></i>
            <div>{{errorMessage}}</div>
          </div>

          <!-- User ID Input -->
          <div class="mb-3">
            <label for="userId" class="form-label fw-semibold small">User ID (6 Digits)</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-person"></i></span>
              <input type="text" id="userId" formControlName="userId" 
                     class="form-control bg-light border-start-0" 
                     placeholder="e.g. 100001" 
                     [ngClass]="{'is-invalid': (f['userId'].dirty || f['userId'].touched) && f['userId'].errors}">
            </div>
            <div class="invalid-feedback d-block" *ngIf="(f['userId'].dirty || f['userId'].touched) && f['userId'].errors">
              <span *ngIf="f['userId'].errors['required']">User ID is required.</span>
              <span *ngIf="f['userId'].errors['pattern']">Please enter a 6 digit no.</span>
            </div>
          </div>

          <!-- Password Input -->
          <div class="mb-4">
            <div class="d-flex justify-content-between">
              <label for="password" class="form-label fw-semibold small">Password (6-10 characters)</label>
            </div>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-key"></i></span>
              <input type="password" id="password" formControlName="password" 
                     class="form-control bg-light border-start-0" 
                     placeholder="••••••••"
                     [ngClass]="{'is-invalid': (f['password'].dirty || f['password'].touched) && f['password'].errors}">
            </div>
            <div class="invalid-feedback d-block" *ngIf="(f['password'].dirty || f['password'].touched) && f['password'].errors">
              <span *ngIf="f['password'].errors['required']">Password is required.</span>
              <span *ngIf="f['password'].errors['minlength'] || f['password'].errors['maxlength']">
                Password must be between 6 and 10 characters.
              </span>
              <span *ngIf="f['password'].errors['numericCheck']">
                Password cannot be purely numeric.
              </span>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="d-grid mb-3">
            <button type="submit" [disabled]="loginForm.invalid || loading" class="btn btn-primary btn-lg rounded-3">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" *ngIf="loading"></span>
              Sign In
            </button>
          </div>

          <div class="text-center mt-3">
            <p class="mb-0 text-muted small">New to OMBS? <a routerLink="/register" class="fw-bold text-decoration-none">Create an Account</a></p>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10), this.passwordValidator]]
    });
  }

  // Custom password validator (no pure numeric password)
  passwordValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    const isPureNumeric = /^\d+$/.test(value);
    return isPureNumeric ? { numericCheck: true } : null;
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        const role = response.role;
        if (role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'MEMBER') {
          this.router.navigate(['/member-dashboard']);
        } else if (role === 'MAID') {
          this.router.navigate(['/maid-dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error:', err);
        if (err && err.error && typeof err.error === 'object' && err.error.error) {
          this.errorMessage = err.error.error;
        } else if (err && err.error && typeof err.error === 'string') {
          try {
            const parsed = JSON.parse(err.error);
            this.errorMessage = parsed.error || err.error;
          } catch(e) {
            this.errorMessage = err.error;
          }
        } else {
          this.errorMessage = 'Login failed. User ID and Password does not match.';
        }
        
        try {
          this.cdr.detectChanges();
        } catch(e) {}
      }
    });
  }
}
