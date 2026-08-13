import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="row">
        <!-- Sidebar Navigation -->
        <div class="col-md-3 mb-4">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div class="text-center py-3 border-bottom mb-3">
              <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 60px; height: 60px;">
                <i class="bi bi-building fs-3"></i>
              </div>
              <h5 class="fw-bold mb-0">{{profile?.memberName || 'Employer'}}</h5>
              <span class="badge bg-secondary-subtle text-secondary small mt-1">Employer Account</span>
            </div>
            
            <ul class="nav flex-column nav-pills gap-1">
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'profile'}" (click)="setTab('profile')">
                  <i class="bi bi-person-gear me-2"></i> Profile settings
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'create-job'}" (click)="setTab('create-job')">
                  <i class="bi bi-plus-circle me-2"></i> Create Job Request
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'my-jobs'}" (click)="setTab('my-jobs')">
                  <i class="bi bi-card-list me-2"></i> My Jobs & Payments
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'matching-maids'}" (click)="setTab('matching-maids')">
                  <i class="bi bi-people-fill me-2"></i> Matching Maids
                  <span class="badge bg-danger rounded-pill float-end small" *ngIf="matchingMaids.length > 0">{{matchingMaids.length}}</span>
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'feedback'}" (click)="setTab('feedback')">
                  <i class="bi bi-star-half me-2"></i> Leave Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Dashboard Panel Content -->
        <div class="col-md-9">
          <!-- Profile Settings -->
          <div class="card border-0 shadow-sm rounded-4 p-4 p-sm-5 bg-white" *ngIf="activeTab === 'profile'">
            <h4 class="fw-bold mb-4"><i class="bi bi-person-gear text-primary me-2"></i>Profile Settings</h4>
            <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()">
              <div class="row g-3">
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Employer Name</label>
                  <input type="text" formControlName="memberName" class="form-control bg-light">
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Employer ID (Confidential)</label>
                  <input type="text" class="form-control bg-light text-muted" [value]="userId" disabled>
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
                  <label class="form-label fw-semibold small">Address</label>
                  <textarea formControlName="memberAddress" class="form-control bg-light" rows="3"></textarea>
                </div>
                <div class="col-12 mt-4">
                  <button type="submit" class="btn btn-primary rounded-3 px-4" [disabled]="profileForm.invalid">Save Profile</button>
                </div>
              </div>
            </form>
          </div>

          <!-- Create Job Request -->
          <div class="card border-0 shadow-sm rounded-4 p-4 p-sm-5 bg-white" *ngIf="activeTab === 'create-job'">
            <h4 class="fw-bold mb-4"><i class="bi bi-file-earmark-plus text-primary me-2"></i>Create a Job Request</h4>
            <form [formGroup]="jobForm" (ngSubmit)="onCreateJob()">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-semibold small">Job Details / Description</label>
                  <input type="text" formControlName="jobDetail" class="form-control bg-light" placeholder="e.g. Need baby sitter for infants or House Cleaner for 2 BHK">
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Job Specialty</label>
                  <select formControlName="specialty" class="form-select bg-light">
                    <option value="Baby sitter">Baby sitter</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Cook">Cook</option>
                    <option value="All rounder">All rounder</option>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Job Type</label>
                  <select formControlName="jobType" class="form-select bg-light">
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Location / Address</label>
                  <input type="text" formControlName="jobLocation" class="form-control bg-light" placeholder="e.g. Noida, Bangalore">
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Salary Offering (₹ per month)</label>
                  <input type="number" formControlName="salary" class="form-control bg-light" placeholder="e.g. 10000">
                </div>
                <div class="col-12 mt-4">
                  <button type="submit" class="btn btn-primary rounded-3 px-4" [disabled]="jobForm.invalid">Submit Job Request</button>
                </div>
              </div>
            </form>
          </div>

          <!-- My Jobs & Payments -->
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white" *ngIf="activeTab === 'my-jobs'">
            <h4 class="fw-bold mb-4"><i class="bi bi-card-list text-primary me-2"></i>My Job Requests & Payments</h4>
            
            <div class="table-responsive" *ngIf="myJobs.length > 0; else noJobs">
              <table class="table table-hover align-middle border-0">
                <thead class="table-light border-0">
                  <tr>
                    <th>Job Description</th>
                    <th>Location</th>
                    <th>Salary</th>
                    <th>Maid Allocated</th>
                    <th>Status</th>
                    <th>Billing Fee</th>
                    <th>Contact Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let job of myJobs">
                    <td>
                      <div class="fw-semibold text-dark">{{job.jobDetail}}</div>
                      <small class="text-muted">{{job.jobType}}</small>
                    </td>
                    <td>{{job.jobLocation}}</td>
                    <td>₹{{job.salary}}/mo</td>
                    <td>
                      <span class="badge bg-secondary-subtle text-secondary" *ngIf="!job.maidId">None</span>
                      <span class="badge bg-primary-subtle text-primary" *ngIf="job.maidId">Maid: {{job.maidId}}</span>
                    </td>
                    <td>
                      <span class="badge rounded-pill px-2 py-1" 
                            [ngClass]="{
                              'bg-warning-subtle text-warning': job.status === 'PENDING',
                              'bg-info-subtle text-info': job.status === 'ALLOCATED',
                              'bg-success-subtle text-success': job.status === 'COMPLETED'
                            }">
                        {{job.status}}
                      </span>
                    </td>
                    <td>
                      <!-- Get specific transaction status -->
                      <ng-container *ngIf="getPaymentForJob(job.jobId) as payment">
                        <span class="badge bg-success-subtle text-success" *ngIf="payment.paymentDone === 'Yes'">Paid (₹{{payment.amount}})</span>
                        <button class="btn btn-danger btn-sm rounded-pill px-3" 
                                *ngIf="payment.paymentDone === 'No'"
                                (click)="onPayFee(payment.transactionId)">
                          Pay ₹{{payment.amount}}
                        </button>
                      </ng-container>
                      <span class="text-muted small" *ngIf="!getPaymentForJob(job.jobId)">No allocation yet</span>
                    </td>
                    <td>
                      <!-- Reveal contact details only if payment is Done -->
                      <ng-container *ngIf="getPaymentForJob(job.jobId) as payment">
                        <div *ngIf="payment.paymentDone === 'Yes'; else maskedContact">
                          <button class="btn btn-outline-primary btn-sm rounded-pill" (click)="revealMaidContact(job.maidId)">
                            <i class="bi bi-eye-fill"></i> View Contact
                          </button>
                        </div>
                      </ng-container>
                      <ng-template #maskedContact>
                        <span class="text-muted small"><i class="bi bi-lock-fill"></i> Unlocks on payment</span>
                      </ng-template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ng-template #noJobs>
              <div class="text-center py-5">
                <i class="bi bi-file-earmark-plus text-muted display-2 mb-3 d-block"></i>
                <h5 class="text-muted">You haven't submitted any job requests yet.</h5>
                <button class="btn btn-primary rounded-pill px-4 mt-2" (click)="setTab('create-job')">Submit First Request</button>
              </div>
            </ng-template>
          </div>

          <!-- Matching Maids -->
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white" *ngIf="activeTab === 'matching-maids'">
            <h4 class="fw-bold mb-4"><i class="bi bi-people-fill text-primary me-2"></i>Matching Maids Nearby</h4>
            <p class="text-muted small">Available maids residing in your area ({{profile?.memberAddress}})</p>

            <div class="row g-4" *ngIf="matchingMaids.length > 0; else noMaids">
              <div class="col-md-6" *ngFor="let maid of matchingMaids">
                <div class="card border border-light-subtle rounded-4 p-3 h-100">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-success-subtle text-success">{{maid.status}}</span>
                    <span class="text-muted small">ID: {{maid.maidId}}</span>
                  </div>
                  <h5 class="fw-bold mb-1">{{maid.maidType}}</h5>
                  <p class="text-muted small mb-2"><i class="bi bi-geo-alt me-1"></i>{{maid.maidAddress}}</p>
                  
                  <div class="d-flex gap-3 bg-light rounded p-2 text-center small mb-3">
                    <div class="flex-grow-1">
                      <span class="text-muted d-block small">Exp</span>
                      <strong class="text-dark">{{maid.experienceYears}} Years</strong>
                    </div>
                    <div class="flex-grow-1 border-start">
                      <span class="text-muted d-block small">Age</span>
                      <strong class="text-dark">{{maid.maidAge}} Years</strong>
                    </div>
                    <div class="flex-grow-1 border-start">
                      <span class="text-muted d-block small">Expected</span>
                      <strong class="text-dark">₹{{maid.salaryExpectation}}</strong>
                    </div>
                  </div>
                  
                  <div class="bg-warning-subtle text-warning text-center rounded p-2 small">
                    <i class="bi bi-lock-fill me-1"></i> Contact details are hidden. Allocate and pay to unlock.
                  </div>
                </div>
              </div>
            </div>

            <ng-template #noMaids>
              <div class="text-center py-5">
                <i class="bi bi-emoji-smile text-muted display-2 mb-3 d-block"></i>
                <h5 class="text-muted">No maids currently registered in your exact area.</h5>
                <p class="text-muted-50 small">New profiles are verified daily. Check back soon!</p>
              </div>
            </ng-template>
          </div>

          <!-- Leave Feedback -->
          <div class="card border-0 shadow-sm rounded-4 p-4 p-sm-5 bg-white" *ngIf="activeTab === 'feedback'">
            <h4 class="fw-bold mb-4"><i class="bi bi-star text-primary me-2"></i>Submit Feedback</h4>
            <form [formGroup]="feedbackForm" (ngSubmit)="onSubmitFeedback()">
              <div class="row g-3">
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Receiver User ID (Maid's 6-digit ID)</label>
                  <input type="text" formControlName="receiverId" class="form-control bg-light" placeholder="e.g. 200001">
                  <div class="invalid-feedback d-block" *ngIf="fFeedback['receiverId'].touched && fFeedback['receiverId'].errors">
                    Receiver ID is required and must be 6 digits.
                  </div>
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold small">Rating (1 to 5 Stars)</label>
                  <select formControlName="rating" class="form-select bg-light">
                    <option value="5">5 - Excellent Service</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold small">Comments / Feedback details</label>
                  <textarea formControlName="comments" class="form-control bg-light" rows="4" placeholder="Share your experience..."></textarea>
                  <div class="invalid-feedback d-block" *ngIf="fFeedback['comments'].touched && fFeedback['comments'].errors">
                    Comments are required.
                  </div>
                </div>
                <div class="col-12 mt-4">
                  <button type="submit" class="btn btn-primary rounded-3 px-4" [disabled]="feedbackForm.invalid">Submit Feedback</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MemberDashboardComponent implements OnInit {
  userId: string = '';
  activeTab: string = 'profile';
  profile: any = null;
  myJobs: any[] = [];
  myPayments: any[] = [];
  matchingMaids: any[] = [];

  profileForm!: FormGroup;
  jobForm!: FormGroup;
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
      memberName: ['', Validators.required],
      memberAddress: ['', Validators.required],
      contactEmail: ['', [Validators.email]],
      contactPhone: ['', Validators.required]
    });

    this.jobForm = this.fb.group({
      jobDetail: ['', Validators.required],
      specialty: ['Cleaner', Validators.required],
      jobType: ['Full Time', Validators.required],
      jobLocation: ['', Validators.required],
      salary: [6000, [Validators.required, Validators.min(1000)]]
    });

    this.feedbackForm = this.fb.group({
      receiverId: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      rating: [5, Validators.required],
      comments: ['', Validators.required]
    });

    // Load Data
    this.loadProfile();
    this.loadJobsAndPayments();
  }

  get fFeedback() {
    return this.feedbackForm.controls;
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'matching-maids') {
      this.loadMatchingMaids();
    }
  }

  loadProfile(): void {
    this.dataService.getMemberProfile(this.userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          memberName: profile.memberName,
          memberAddress: profile.memberAddress,
          contactEmail: profile.contactEmail,
          contactPhone: profile.contactPhone
        });
        
        this.loadMatchingMaids();
      },
      error: (err) => console.error('Failed to fetch profile:', err)
    });
  }

  loadJobsAndPayments(): void {
    this.dataService.getJobsByMember(this.userId).subscribe({
      next: (jobs) => {
        this.myJobs = jobs;
      },
      error: (err) => console.error('Failed to load member jobs:', err)
    });

    this.dataService.getPaymentsByMember(this.userId).subscribe({
      next: (payments) => {
        this.myPayments = payments;
      },
      error: (err) => console.error('Failed to load member payments:', err)
    });
  }

  loadMatchingMaids(): void {
    this.dataService.getSuggestedMaidsForMember(this.userId).subscribe({
      next: (maids) => {
        this.matchingMaids = maids;
      },
      error: (err) => console.error('Failed to load matching maids:', err)
    });
  }

  getPaymentForJob(jobId: number): any {
    return this.myPayments.find(p => p.jobId === jobId);
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid) return;
    this.dataService.updateMemberProfile(this.userId, this.profileForm.value).subscribe({
      next: (updated) => {
        this.profile = updated;
        alert('Profile saved successfully!');
      },
      error: (err) => alert('Failed to update profile: ' + err.error?.error)
    });
  }

  onCreateJob(): void {
    if (this.jobForm.invalid) return;
    
    // Construct Job object
    const val = this.jobForm.value;
    const jobPayload = {
      jobDetail: val.jobDetail + ' (' + val.specialty + ')',
      jobType: val.jobType,
      jobLocation: val.jobLocation,
      salary: val.salary,
      memberId: this.userId
    };

    this.dataService.createJob(jobPayload).subscribe({
      next: () => {
        alert('Job request submitted successfully!');
        this.jobForm.reset({ specialty: 'Cleaner', jobType: 'Full Time', salary: 6000 });
        this.loadJobsAndPayments();
        this.setTab('my-jobs');
      },
      error: (err) => alert('Failed to submit job request: ' + err.error?.error)
    });
  }

  onPayFee(transactionId: number): void {
    if (confirm('Confirm simulated transfer of ₹500 fee to the site bank account?')) {
      this.dataService.payFee(transactionId).subscribe({
        next: () => {
          alert('Payment completed successfully! Contact details are unlocked.');
          this.loadJobsAndPayments();
        },
        error: (err) => alert('Payment failed: ' + err.error?.error)
      });
    }
  }

  revealMaidContact(maidId: string): void {
    this.dataService.getMaidProfile(maidId).subscribe({
      next: (maid) => {
        const maidName = maid.maidName || ('Maid Candidate #' + maid.maidId);
        const phone = maid.contactPhone || 'Not provided';
        const email = maid.contactEmail || 'Not provided';
        const address = maid.maidAddress || 'Not provided';
        const maidType = maid.maidType || 'Domestic Helper';
        alert(`Maid Contact Details Unlocked:\nName: ${maidName}\nMaid ID: ${maid.maidId}\nSpecialty: ${maidType}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}`);
      },
      error: (err) => alert('Failed to retrieve maid contact: ' + err.error?.error)
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
