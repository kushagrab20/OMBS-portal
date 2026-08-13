import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-maid-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="row">
        <!-- Sidebar Navigation -->
        <div class="col-md-3 mb-4">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div class="text-center py-3 border-bottom mb-3">
              <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 60px; height: 60px;">
                <i class="bi bi-person-lines-fill fs-3"></i>
              </div>
              <h5 class="fw-bold mb-0">Maid Profile</h5>
              <span class="badge" [ngClass]="profile?.status === 'AVAILABLE' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'">
                {{profile?.status || 'UNKNOWN'}}
              </span>
            </div>
            
            <ul class="nav flex-column nav-pills gap-1">
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'profile'}" (click)="setTab('profile')">
                  <i class="bi bi-person-gear me-2"></i> Profile settings
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'allocated-jobs'}" (click)="setTab('allocated-jobs')">
                  <i class="bi bi-house-check-fill me-2"></i> Allocated Employers
                  <span class="badge bg-success rounded-pill float-end small" *ngIf="allocatedJobs.length > 0">{{allocatedJobs.length}}</span>
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'matching-jobs'}" (click)="setTab('matching-jobs')">
                  <i class="bi bi-briefcase-fill me-2"></i> Suggested Jobs
                  <span class="badge bg-danger rounded-pill float-end small" *ngIf="matchingJobs.length > 0">{{matchingJobs.length}}</span>
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'wait-time'}" (click)="setTab('wait-time')">
                  <i class="bi bi-hourglass-split me-2"></i> My Wait Time
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'feedback'}" (click)="setTab('feedback')">
                  <i class="bi bi-star-half me-2"></i> Employer Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Dashboard Panel Content -->
        <div class="col-md-9">
          <!-- Profile Settings -->
          <div class="card border-0 shadow-sm rounded-4 p-4 p-sm-5 bg-white" *ngIf="activeTab === 'profile'">
            <h4 class="fw-bold mb-4"><i class="bi bi-person-gear text-success me-2"></i>Maid Profile Settings</h4>
            <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()">
              <div class="row g-3">
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Specialty / Skill Type</label>
                  <select formControlName="maidType" class="form-select bg-light">
                    <option value="Baby sitter">Baby sitter</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Cook">Cook</option>
                    <option value="All rounder">All rounder</option>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Age (Yrs)</label>
                  <input type="number" formControlName="maidAge" class="form-control bg-light">
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Experience (Years)</label>
                  <input type="number" formControlName="experienceYears" class="form-control bg-light">
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Preferred Job Type</label>
                  <select formControlName="preferredJobType" class="form-select bg-light">
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Expected Salary (₹ / month)</label>
                  <input type="number" formControlName="salaryExpectation" class="form-control bg-light">
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Availability Status</label>
                  <select formControlName="status" class="form-select bg-light">
                    <option value="AVAILABLE">Available</option>
                    <option value="ALLOCATED">Allocated</option>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Contact Email</label>
                  <input type="email" formControlName="contactEmail" class="form-control bg-light">
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Contact Phone</label>
                  <input type="text" formControlName="contactPhone" class="form-control bg-light">
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold small">Residing Address</label>
                  <textarea formControlName="maidAddress" class="form-control bg-light" rows="3"></textarea>
                </div>
                <div class="col-12 mt-4">
                  <button type="submit" class="btn btn-success rounded-3 px-4" [disabled]="profileForm.invalid">Save Profile</button>
                </div>
              </div>
            </form>
          </div>

          <!-- Allocated Employers Tab -->
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white" *ngIf="activeTab === 'allocated-jobs'">
            <h4 class="fw-bold mb-3"><i class="bi bi-house-check-fill text-success me-2"></i>My Allocated Employers & Workplaces</h4>
            <p class="text-muted small mb-4">Complete workplace details, employer contact numbers, and bureau payment status for your active job placements.</p>

            <div *ngIf="allocatedJobs.length > 0; else noAllocatedJobs">
              <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden border-start border-4 border-success bg-light-subtle" *ngFor="let job of allocatedJobs">
                <div class="card-header bg-light border-0 d-flex justify-content-between align-items-center py-3">
                  <div>
                    <span class="badge bg-success me-2">ALLOCATED</span>
                    <strong class="text-dark">Job Request #{{job.jobId}}</strong>
                  </div>
                  <div class="text-success fw-bold fs-5">₹{{job.salary}} / month</div>
                </div>

                <div class="card-body p-4 bg-white">
                  <div class="row g-4">
                    <!-- Employer Details -->
                    <div class="col-md-6 border-end">
                      <h6 class="fw-bold text-success mb-3"><i class="bi bi-person-badge me-2"></i>Employer (User) Contact Details</h6>
                      <div class="mb-3">
                        <small class="text-muted d-block">Employer Name:</small>
                        <span class="fw-bold text-dark fs-5">{{job.employer?.memberName || 'Employer #' + job.memberId}}</span>
                      </div>
                      <div class="mb-3">
                        <small class="text-muted d-block">Employer Phone Number:</small>
                        <a [href]="'tel:' + (job.employer?.contactPhone || '')" class="fw-bold text-primary fs-6 text-decoration-none">
                          <i class="bi bi-telephone-fill me-1"></i> {{job.employer?.contactPhone || 'Not provided'}}
                        </a>
                      </div>
                      <div class="mb-3">
                        <small class="text-muted d-block">Employer Email Address:</small>
                        <span class="text-dark fw-semibold"><i class="bi bi-envelope me-1 text-secondary"></i> {{job.employer?.contactEmail || 'Not provided'}}</span>
                      </div>
                      <div>
                        <small class="text-muted d-block">Workplace Address:</small>
                        <span class="text-dark fw-semibold"><i class="bi bi-geo-alt-fill text-danger me-1"></i> {{job.employer?.memberAddress || job.jobLocation || 'Not provided'}}</span>
                      </div>
                    </div>

                    <!-- Job & Payment Status Details -->
                    <div class="col-md-6">
                      <h6 class="fw-bold text-success mb-3"><i class="bi bi-card-checklist me-2"></i>Job & Payment Status Information</h6>
                      <div class="mb-3">
                        <small class="text-muted d-block">Job Description & Type:</small>
                        <span class="fw-bold text-dark">{{job.jobDetail}}</span>
                        <span class="badge bg-secondary ms-2">{{job.jobType}}</span>
                      </div>
                      <div class="mb-3">
                        <small class="text-muted d-block">Job Location:</small>
                        <span class="text-dark fw-semibold">{{job.jobLocation}}</span>
                      </div>
                      <div class="mb-3">
                        <small class="text-muted d-block">Employer Matching Fee Payment:</small>
                        <span class="badge rounded-pill px-3 py-2" [ngClass]="job.paymentStatus?.paymentDone === 'Yes' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'">
                          <i class="bi" [ngClass]="job.paymentStatus?.paymentDone === 'Yes' ? 'bi-check-circle-fill' : 'bi-clock-history'"></i>
                          {{job.paymentStatus?.paymentDone === 'Yes' ? 'Completed (Paid)' : 'Pending Payment'}}
                        </span>
                      </div>
                      <div>
                        <small class="text-muted d-block">Allocation Date:</small>
                        <span class="text-muted small">{{job.createdAt | date:'mediumDate'}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ng-template #noAllocatedJobs>
              <div class="text-center py-5">
                <i class="bi bi-briefcase text-muted display-2 mb-3 d-block"></i>
                <h5 class="text-muted">No active job allocations found.</h5>
                <p class="text-muted-50 small">Once the Bureau Admin allocates you to an employer request, all details will appear here.</p>
              </div>
            </ng-template>
          </div>

          <!-- Suggested Jobs (Matching Logic) -->
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white" *ngIf="activeTab === 'matching-jobs'">
            <h4 class="fw-bold mb-4"><i class="bi bi-briefcase-fill text-success me-2"></i>Suggested Job Postings</h4>
            <p class="text-muted small">Job matching suggestions based on your specialty ({{profile?.maidType}}) and location ({{profile?.maidAddress}})</p>

            <div class="table-responsive" *ngIf="matchingJobs.length > 0; else noJobs">
              <table class="table table-hover align-middle border-0">
                <thead class="table-light border-0">
                  <tr>
                    <th>Job Title & Detail</th>
                    <th>Location</th>
                    <th>Salary Offering</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let job of matchingJobs">
                    <td>
                      <div class="fw-bold text-dark">{{job.jobDetail}}</div>
                      <small class="text-muted">{{job.jobType}}</small>
                    </td>
                    <td><i class="bi bi-geo-alt me-1"></i>{{job.jobLocation}}</td>
                    <td><strong class="text-success">₹{{job.salary}}/mo</strong></td>
                    <td>
                      <span class="badge rounded-pill bg-warning-subtle text-warning">{{job.status}}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ng-template #noJobs>
              <div class="text-center py-5">
                <i class="bi bi-emoji-frown text-muted display-2 mb-3 d-block"></i>
                <h5 class="text-muted">No matching jobs currently open in your area.</h5>
                <p class="text-muted-50 small">We will notify you immediately once a matching job is created by an employer.</p>
              </div>
            </ng-template>
          </div>

          <!-- Wait Time -->
          <div class="card border-0 shadow-sm rounded-4 p-4 p-sm-5 bg-white" *ngIf="activeTab === 'wait-time'">
            <h4 class="fw-bold mb-4"><i class="bi bi-hourglass-split text-success me-2"></i>Check Wait Time Metrics</h4>
            
            <div class="row align-items-center bg-light rounded-4 p-4 mb-4">
              <div class="col-md-3 text-center mb-3 mb-md-0">
                <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                  <i class="bi bi-hourglass fs-2"></i>
                </div>
              </div>
              <div class="col-md-9">
                <h4 class="fw-bold mb-1">Average Wait Time: 4.5 Days</h4>
                <p class="text-muted mb-0 small">
                  Calculated based on average duration between registration and successful job allocations in your area in the last 12 months.
                </p>
              </div>
            </div>

            <div class="card border-light-subtle rounded-4 p-3 mb-4">
              <h5 class="fw-bold mb-3"><i class="bi bi-list-stars me-2"></i>Current Status Breakdown</h5>
              <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span>Registration Status</span>
                <span class="badge bg-success">Active & Verified</span>
              </div>
              <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span>Queue Position</span>
                <span class="fw-bold">#2 in Noida Sector 62</span>
              </div>
              <div class="d-flex justify-content-between align-items-center py-2">
                <span>Job Allocation Status</span>
                <span class="fw-semibold text-success">{{profile?.status}}</span>
              </div>
            </div>

            <div class="alert alert-info border-0 rounded-4">
              <i class="bi bi-info-circle-fill me-2"></i>
              Keep your profile, salary expectation, and contact numbers updated to lower your match wait time.
            </div>
          </div>

          <!-- Employer Feedback -->
          <div class="card border-0 shadow-sm rounded-4 p-4 p-sm-5 bg-white" *ngIf="activeTab === 'feedback'">
            <h4 class="fw-bold mb-4"><i class="bi bi-chat-left-text text-success me-2"></i>Leave Feedback for Employer</h4>
            <form [formGroup]="feedbackForm" (ngSubmit)="onSubmitFeedback()">
              <div class="row g-3">
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Employer User ID (6-digit Member ID)</label>
                  <input type="text" formControlName="receiverId" class="form-control bg-light" placeholder="e.g. 100001">
                  <div class="invalid-feedback d-block" *ngIf="fFeedback['receiverId'].touched && fFeedback['receiverId'].errors">
                    Receiver ID is required and must be 6 digits.
                  </div>
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Rating (1 to 5 Stars)</label>
                  <select formControlName="rating" class="form-select bg-light">
                    <option value="5">5 - Excellent Employer</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold small">Comments / Feedback details</label>
                  <textarea formControlName="comments" class="form-control bg-light" rows="4" placeholder="Describe the working environment and employer behavior..."></textarea>
                  <div class="invalid-feedback d-block" *ngIf="fFeedback['comments'].touched && fFeedback['comments'].errors">
                    Comments are required.
                  </div>
                </div>
                <div class="col-12 mt-4">
                  <button type="submit" class="btn btn-success rounded-3 px-4" [disabled]="feedbackForm.invalid">Submit Feedback</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MaidDashboardComponent implements OnInit {
  userId: string = '';
  activeTab: string = 'profile';
  profile: any = null;
  matchingJobs: any[] = [];
  allocatedJobs: any[] = [];

  profileForm!: FormGroup;
  feedbackForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    
    // Initialize Forms
    this.profileForm = this.fb.group({
      maidType: ['Cleaner', Validators.required],
      maidAge: [25, [Validators.required, Validators.min(18), Validators.max(65)]],
      experienceYears: [1, [Validators.required, Validators.min(0)]],
      preferredJobType: ['Full Time', Validators.required],
      salaryExpectation: [8000, [Validators.required, Validators.min(1000)]],
      status: ['AVAILABLE', Validators.required],
      contactEmail: ['', [Validators.email]],
      contactPhone: ['', Validators.required],
      maidAddress: ['', Validators.required]
    });

    this.feedbackForm = this.fb.group({
      receiverId: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      rating: [5, Validators.required],
      comments: ['', Validators.required]
    });

    this.loadProfile();
    this.loadAllocatedJobs();
  }

  get fFeedback() {
    return this.feedbackForm.controls;
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'matching-jobs') {
      this.loadMatchingJobs();
    } else if (tab === 'allocated-jobs') {
      this.loadAllocatedJobs();
    }
  }

  loadProfile(): void {
    this.dataService.getMaidProfile(this.userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          maidType: profile.maidType,
          maidAge: profile.maidAge,
          experienceYears: profile.experienceYears,
          preferredJobType: profile.preferredJobType,
          salaryExpectation: profile.salaryExpectation,
          status: profile.status,
          contactEmail: profile.contactEmail,
          contactPhone: profile.contactPhone,
          maidAddress: profile.maidAddress
        });
        
        // If maid is allocated, default to allocated-jobs tab
        if (profile.status === 'ALLOCATED') {
          this.activeTab = 'allocated-jobs';
        }
        
        this.loadMatchingJobs();
      },
      error: (err) => console.error('Failed to fetch profile:', err)
    });
  }

  loadAllocatedJobs(): void {
    this.dataService.getJobsByMaid(this.userId).subscribe({
      next: (jobs) => {
        this.allocatedJobs = jobs || [];
        // Fetch employer member profile & payment status for each allocated job
        this.allocatedJobs.forEach((job) => {
          if (job.memberId) {
            this.dataService.getMemberProfile(job.memberId).subscribe({
              next: (member) => job.employer = member,
              error: () => job.employer = null
            });
          }
          if (job.jobId) {
            this.dataService.getPaymentStatus(job.jobId).subscribe({
              next: (pay) => job.paymentStatus = pay,
              error: () => job.paymentStatus = null
            });
          }
        });
      },
      error: (err) => console.error('Failed to fetch allocated jobs for maid:', err)
    });
  }

  loadMatchingJobs(): void {
    this.dataService.getSuggestedJobsForMaid(this.userId).subscribe({
      next: (jobs) => {
        this.matchingJobs = jobs;
      },
      error: (err) => console.error('Failed to fetch matching jobs:', err)
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) return;
    this.dataService.updateMaidProfile(this.userId, this.profileForm.value).subscribe({
      next: (updated) => {
        this.profile = updated;
        alert('Profile saved successfully!');
      },
      error: (err) => alert('Failed to update profile: ' + err.error?.error)
    });
  }

  onSubmitFeedback(): void {
    if (this.feedbackForm.invalid) return;
    const feedbackPayload = {
      senderId: this.userId,
      receiverId: this.feedbackForm.value.receiverId,
      rating: parseInt(this.feedbackForm.value.rating, 10),
      comments: this.feedbackForm.value.comments
    };

    this.dataService.submitFeedback(feedbackPayload).subscribe({
      next: () => {
        alert('Feedback submitted successfully!');
        this.feedbackForm.reset({ rating: 5 });
      },
      error: (err) => alert('Failed to submit feedback: ' + err.error?.error)
    });
  }
}
