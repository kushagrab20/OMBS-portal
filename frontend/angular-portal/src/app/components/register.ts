import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container d-flex align-items-center justify-content-center py-5" style="min-height: 80vh;">
      <div class="card border-0 shadow-lg rounded-4 p-4 p-sm-5 w-100" style="max-width: 600px;">
        <div class="text-center mb-4">
          <i class="bi bi-person-plus text-primary display-4 mb-2 d-inline-block"></i>
          <h2 class="fw-bold mb-1">Create Account</h2>
          <p class="text-muted small">Register to get started with Online Maid Bureau System</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <!-- General Error Message -->
          <div class="alert alert-danger rounded-3 p-2 small border-0 mb-3" *ngIf="errorMessage">
            <i class="bi bi-exclamation-triangle-fill me-1"></i> {{errorMessage}}
          </div>

          <!-- Role Selection -->
          <div class="mb-3">
            <label class="form-label fw-semibold small d-block">Account Type</label>
            <div class="btn-group w-100" role="group">
              <input type="radio" class="btn-check" name="role" id="roleMember" value="MEMBER" formControlName="role" (change)="onRoleChange('MEMBER')">
              <label class="btn btn-outline-primary py-2 w-50" for="roleMember"><i class="bi bi-building me-1"></i> Employer (Member)</label>

              <input type="radio" class="btn-check" name="role" id="roleMaid" value="MAID" formControlName="role" (change)="onRoleChange('MAID')">
              <label class="btn btn-outline-primary py-2 w-50" for="roleMaid"><i class="bi bi-person-lines-fill me-1"></i> Maid (Employee)</label>
            </div>
          </div>

          <div class="row g-3">
            <!-- User ID Input -->
            <div class="col-sm-6">
              <label for="userId" class="form-label fw-semibold small">User ID (6 Digits)</label>
              <input type="text" id="userId" formControlName="userId" 
                     class="form-control bg-light" 
                     placeholder="e.g. 100003" 
                     [ngClass]="{'is-invalid': (f['userId'].dirty || f['userId'].touched) && f['userId'].errors}">
              <div class="invalid-feedback" *ngIf="(f['userId'].dirty || f['userId'].touched) && f['userId'].errors">
                <span *ngIf="f['userId'].errors['required']">User ID is required.</span>
                <span *ngIf="f['userId'].errors['pattern']">Please enter a 6 digit no.</span>
              </div>
            </div>

            <!-- Password Input -->
            <div class="col-sm-6">
              <label for="password" class="form-label fw-semibold small">Password (6-10 char)</label>
              <input type="password" id="password" formControlName="password" 
                     class="form-control bg-light" 
                     placeholder="••••••••"
                     [ngClass]="{'is-invalid': (f['password'].dirty || f['password'].touched) && f['password'].errors}">
              <div class="invalid-feedback" *ngIf="(f['password'].dirty || f['password'].touched) && f['password'].errors">
                <span *ngIf="f['password'].errors['required']">Password is required.</span>
                <span *ngIf="f['password'].errors['minlength'] || f['password'].errors['maxlength']">Password must be 6-10 characters.</span>
                <span *ngIf="f['password'].errors['numericCheck']">Password cannot be purely numeric.</span>
              </div>
            </div>

            <!-- Full Name -->
            <div class="col-12">
              <label for="name" class="form-label fw-semibold small">Full Name</label>
              <input type="text" id="name" formControlName="name" 
                     class="form-control bg-light" 
                     placeholder="e.g. John Doe"
                     [ngClass]="{'is-invalid': f['name'].touched && f['name'].errors}">
              <div class="invalid-feedback" *ngIf="f['name'].touched && f['name'].errors">
                Name is required.
              </div>
            </div>

            <!-- Email and Phone -->
            <div class="col-sm-6">
              <label for="email" class="form-label fw-semibold small">Email Address</label>
              <input type="email" id="email" formControlName="email" 
                     class="form-control bg-light" 
                     placeholder="e.g. john@example.com"
                     [ngClass]="{'is-invalid': f['email'].touched && f['email'].errors}">
            </div>
            <div class="col-sm-6">
              <label for="phone" class="form-label fw-semibold small">Phone Number (10 Digits)</label>
              <input type="text" id="phone" formControlName="phone" 
                     class="form-control bg-light" 
                     placeholder="e.g. 9876543210"
                     [ngClass]="{'is-invalid': (f['phone'].dirty || f['phone'].touched) && f['phone'].errors}">
              <div class="invalid-feedback d-block" *ngIf="(f['phone'].dirty || f['phone'].touched) && f['phone'].errors">
                <span *ngIf="f['phone'].errors['required']">Phone number is required.</span>
                <span *ngIf="f['phone'].errors['pattern']">Please enter a valid 10-digit mobile number.</span>
              </div>
            </div>

            <!-- Address -->
            <div class="col-12">
              <label for="address" class="form-label fw-semibold small">Full Address</label>
              <textarea id="address" formControlName="address" 
                        class="form-control bg-light" rows="2" 
                        placeholder="House no, Street Name, City"
                        [ngClass]="{'is-invalid': f['address'].touched && f['address'].errors}"></textarea>
              <div class="invalid-feedback" *ngIf="f['address'].touched && f['address'].errors">
                Address is required.
              </div>
            </div>

            <!-- Maid Details Section (Conditional) -->
            <div class="col-sm-4" *ngIf="f['role'].value === 'MAID'">
              <label for="age" class="form-label fw-semibold small">Age (18-65)</label>
              <input type="number" id="age" formControlName="age" 
                     class="form-control bg-light" 
                     placeholder="e.g. 28"
                     [ngClass]="{'is-invalid': f['age'].touched && f['age'].errors}">
              <div class="invalid-feedback" *ngIf="f['age'].touched && f['age'].errors">
                Age must be 18-65.
              </div>
            </div>

            <div class="col-sm-4" *ngIf="f['role'].value === 'MAID'">
              <label for="experienceYears" class="form-label fw-semibold small">Experience (Years)</label>
              <input type="number" id="experienceYears" formControlName="experienceYears" 
                     class="form-control bg-light" 
                     placeholder="e.g. 3"
                     [ngClass]="{'is-invalid': f['experienceYears'].touched && f['experienceYears'].errors}">
              <div class="invalid-feedback" *ngIf="f['experienceYears'].touched && f['experienceYears'].errors">
                Required (min 0).
              </div>
            </div>

            <div class="col-sm-4" *ngIf="f['role'].value === 'MAID'">
              <label for="maidType" class="form-label fw-semibold small">Maid Specialty</label>
              <select id="maidType" formControlName="maidType" 
                      class="form-select bg-light"
                      [ngClass]="{'is-invalid': f['maidType'].touched && f['maidType'].errors}">
                <option value="Baby sitter">Baby sitter</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Cook">Cook</option>
                <option value="All rounder">All rounder</option>
              </select>
              <div class="invalid-feedback" *ngIf="f['maidType'].touched && f['maidType'].errors">
                Specialty required.
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="d-grid mt-4 mb-3">
            <button type="submit" [disabled]="registerForm.invalid || loading" class="btn btn-primary btn-lg rounded-3">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" *ngIf="loading"></span>
              Create Account
            </button>
          </div>

          <div class="text-center mt-3">
            <p class="mb-0 text-muted small">Already have an account? <a routerLink="/login" class="fw-bold text-decoration-none">Sign In</a></p>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      role: ['MEMBER', Validators.required],
      userId: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10), this.passwordValidator]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      age: [null],
      maidType: ['Cleaner'],
      experienceYears: [1]
    });
  }

  ngOnInit(): void {
    this.onRoleChange('MEMBER');
  }

  // Custom password validator (no pure numeric password)
  passwordValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    const isPureNumeric = /^\d+$/.test(value);
    return isPureNumeric ? { numericCheck: true } : null;
  }

  get f() {
    return this.registerForm.controls;
  }

  onRoleChange(role: string): void {
    const ageControl = this.registerForm.get('age');
    const maidTypeControl = this.registerForm.get('maidType');
    const expControl = this.registerForm.get('experienceYears');

    if (role === 'MAID') {
      ageControl?.setValidators([Validators.required, Validators.min(18), Validators.max(65)]);
      maidTypeControl?.setValidators([Validators.required]);
      expControl?.setValidators([Validators.required, Validators.min(0), Validators.max(50)]);
    } else {
      ageControl?.clearValidators();
      maidTypeControl?.clearValidators();
      expControl?.clearValidators();
    }

    ageControl?.updateValueAndValidity();
    maidTypeControl?.updateValueAndValidity();
    expControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'User ID already exists or registration failed.';
        
        try {
          console.error('Registration error:', err);
          if (err && err.error) {
            if (typeof err.error === 'object' && err.error.error) {
              this.errorMessage = err.error.error;
            } else if (typeof err.error === 'string') {
              try {
                const parsed = JSON.parse(err.error);
                this.errorMessage = parsed.error || err.error;
              } catch (e) {
                this.errorMessage = err.error;
              }
            }
          } else if (err && err.message) {
            this.errorMessage = err.message;
          }
        } catch (e) {
          console.error('Error parsing registration error:', e);
        }
        
        try {
          this.cdr.detectChanges();
        } catch (e) {
          console.error('Error triggering change detection:', e);
        }
      }
    });
  }
}
