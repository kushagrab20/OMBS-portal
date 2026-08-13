import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="row">
        <!-- Sidebar Navigation -->
        <div class="col-md-3 mb-4">
          <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div class="text-center py-3 border-bottom mb-3">
              <div class="bg-dark text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 60px; height: 60px;">
                <i class="bi bi-person-workspace fs-3"></i>
              </div>
              <h5 class="fw-bold mb-0">System Admin</h5>
              <span class="badge bg-danger-subtle text-danger small mt-1">Super Admin Mode</span>
            </div>
            
            <ul class="nav flex-column nav-pills gap-1">
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'allocate'}" (click)="setTab('allocate')">
                  <i class="bi bi-person-fill-add me-2"></i> Allocate Maids
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'payments'}" (click)="setTab('payments')">
                  <i class="bi bi-cash-coin me-2"></i> Payment History
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'feedback'}" (click)="setTab('feedback')">
                  <i class="bi bi-chat-left-quote me-2"></i> Moderate Feedback
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link w-100 text-start py-2 border-0" [ngClass]="{'active': activeTab === 'analytics'}" (click)="setTab('analytics')">
                  <i class="bi bi-graph-up-arrow me-2"></i> Reports & Analytics
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Dashboard Panel Content -->
        <div class="col-md-9">
          <!-- Allocate Maids -->
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white" *ngIf="activeTab === 'allocate'">
            <h4 class="fw-bold mb-4"><i class="bi bi-person-fill-add text-primary me-2"></i>Allocate Maids to Job Requests</h4>
            
            <div class="table-responsive" *ngIf="pendingJobs.length > 0; else noPending">
              <table class="table table-hover align-middle border-0">
                <thead class="table-light border-0">
                  <tr>
                    <th>Job ID</th>
                    <th>Employer (Member)</th>
                    <th>Job Detail</th>
                    <th>Location</th>
                    <th>Salary Offer</th>
                    <th>Assign Maid Candidate</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let job of pendingJobs">
                    <td>#{{job.jobId}}</td>
                    <td>Member: {{job.memberId}}</td>
                    <td>
                      <div class="fw-bold text-dark">{{job.jobDetail}}</div>
                      <small class="text-muted">{{job.jobType}}</small>
                    </td>
                    <td>{{job.jobLocation}}</td>
                    <td>₹{{job.salary}}</td>
                    <td>
                      <select class="form-select form-select-sm bg-light border-0" 
                              [(ngModel)]="selectedMaids[job.jobId]" 
                              name="selectMaid-{{job.jobId}}">
                        <option value="">-- Choose Available Maid --</option>
                        <option *ngFor="let maid of getAvailableMaidsForJob(job)" [value]="maid.maidId">
                          ID: {{maid.maidId}} | {{maid.maidType}} | Exp: {{maid.experienceYears}}y | {{maid.maidAddress}}
                        </option>
                      </select>
                    </td>
                    <td>
                      <button class="btn btn-primary btn-sm rounded-pill px-3" 
                              [disabled]="!selectedMaids[job.jobId]"
                              (click)="onAllocate(job.jobId)">
                        Allocate
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ng-template #noPending>
              <div class="text-center py-5">
                <i class="bi bi-check2-circle text-success display-2 mb-3 d-block"></i>
                <h5 class="text-muted">No pending job requests in the system.</h5>
                <p class="text-muted-50 small">All matching requests have been allocated successfully.</p>
              </div>
            </ng-template>
          </div>

          <!-- Payment History -->
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white" *ngIf="activeTab === 'payments'">
            <h4 class="fw-bold mb-4"><i class="bi bi-cash-coin text-primary me-2"></i>Payment History Log</h4>
            
            <div class="table-responsive" *ngIf="payments.length > 0; else noPayments">
              <table class="table table-hover align-middle border-0">
                <thead class="table-light border-0">
                  <tr>
                    <th>Txn ID</th>
                    <th>Job ID</th>
                    <th>Member ID</th>
                    <th>Member Name</th>
                    <th>Matching Fee</th>
                    <th>Payment Status</th>
                    <th>Date Completed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let pay of payments">
                    <td><strong>#{{pay.transactionId}}</strong></td>
                    <td>Job: #{{pay.jobId}}</td>
                    <td>ID: {{pay.memberId}}</td>
                    <td>{{pay.memberName}}</td>
                    <td>₹{{pay.amount}}</td>
                    <td>
                      <span class="badge rounded-pill px-2 py-1" 
                            [ngClass]="pay.paymentDone === 'Yes' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                        {{pay.paymentDone === 'Yes' ? 'Completed (Paid)' : 'Pending Transfer'}}
                      </span>
                    </td>
                    <td>{{pay.paymentDate ? (pay.paymentDate | date:'medium') : '-'}}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ng-template #noPayments>
              <div class="text-center py-5">
                <i class="bi bi-credit-card-2-back text-muted display-2 mb-3 d-block"></i>
                <h5 class="text-muted">No transaction records found.</h5>
              </div>
            </ng-template>
          </div>

          <!-- Moderate Feedback -->
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white" *ngIf="activeTab === 'feedback'">
            <h4 class="fw-bold mb-4"><i class="bi bi-chat-left-quote text-primary me-2"></i>Feedback Moderation Queue</h4>
            
            <div class="table-responsive" *ngIf="feedbacks.length > 0; else noFeedback">
              <table class="table table-hover align-middle border-0">
                <thead class="table-light border-0">
                  <tr>
                    <th>Feedback ID</th>
                    <th>From</th>
                    <th>To (Receiver)</th>
                    <th>Rating</th>
                    <th>Comments / Feedback Details</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let fb of feedbacks">
                    <td>#{{fb.feedbackId}}</td>
                    <td>ID: {{fb.senderId}}</td>
                    <td>ID: {{fb.receiverId}}</td>
                    <td>
                      <span class="text-warning">
                        <i class="bi bi-star-fill" *ngFor="let star of [].constructor(fb.rating)"></i>
                        <i class="bi bi-star" *ngFor="let star of [].constructor(5 - fb.rating)"></i>
                      </span>
                    </td>
                    <td><span class="fst-italic text-secondary">"{{fb.comments}}"</span></td>
                    <td>{{fb.createdAt | date:'short'}}</td>
                    <td>
                      <button class="btn btn-outline-danger btn-sm rounded-pill px-3" (click)="onDeleteFeedback(fb.feedbackId)">
                        <i class="bi bi-trash"></i> Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ng-template #noFeedback>
              <div class="text-center py-5">
                <i class="bi bi-chat-heart text-muted display-2 mb-3 d-block"></i>
                <h5 class="text-muted">No feedback listings found in the system.</h5>
              </div>
            </ng-template>
          </div>

          <!-- Analytics Dashboard (React Iframe Integration) -->
          <div class="card border-0 shadow-sm rounded-4 p-4 bg-white" *ngIf="activeTab === 'analytics'">
            <h4 class="fw-bold mb-3"><i class="bi bi-graph-up-arrow text-primary me-2"></i>Reports & Analytical Summary</h4>
            
            <div class="border rounded-4 overflow-hidden shadow-sm mt-3">
              <!-- Render React Dashboard via clean dynamic iframe -->
              <iframe src="http://localhost:4300" style="width: 100%; height: 620px; border: none;"></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'allocate';
  pendingJobs: any[] = [];
  availableMaids: any[] = [];
  payments: any[] = [];
  feedbacks: any[] = [];
  selectedMaids: { [jobId: number]: string } = {};

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.loadData();
  }

  loadData(): void {
    if (this.activeTab === 'allocate') {
      this.dataService.getAllJobs().subscribe({
        next: (jobs) => {
          this.pendingJobs = jobs.filter(j => j.status?.toUpperCase() === 'PENDING');
        },
        error: (err) => console.error('Failed to load pending jobs:', err)
      });

      this.dataService.getAllMaids().subscribe({
        next: (maids) => {
          this.availableMaids = maids.filter(m => m.status?.toUpperCase() === 'AVAILABLE');
        },
        error: (err) => console.error('Failed to load available maids:', err)
      });
    } else if (this.activeTab === 'payments') {
      this.dataService.getPaymentHistory().subscribe({
        next: (payments) => {
          this.payments = payments;
        },
        error: (err) => console.error('Failed to load payments:', err)
      });
    } else if (this.activeTab === 'feedback') {
      this.dataService.getAllFeedbacks().subscribe({
        next: (feedbacks) => {
          this.feedbacks = feedbacks;
        },
        error: (err) => console.error('Failed to load feedbacks:', err)
      });
    }
  }

  getAvailableMaidsForJob(job: any): any[] {
    if (!this.availableMaids || this.availableMaids.length === 0) return [];
    
    const desc = (job.jobDetail || '').toLowerCase();
    
    const matched = this.availableMaids.filter(maid => {
      const type = (maid.maidType || '').toLowerCase();
      const isAllRounder = type.includes('all rounder') || type.includes('all-rounder') || type.includes('allrounder');
      
      // All rounders match every job request
      if (isAllRounder) return true;
      
      // Specific maidType match with job description
      return desc.includes(type) || type.includes(desc);
    });

    // Fallback: If no specific specialty maid matches, return all available maids so Admin is never blocked
    return matched.length > 0 ? matched : this.availableMaids;
  }

  onAllocate(jobId: number): void {
    const maidId = this.selectedMaids[jobId];
    if (!maidId) return;

    this.dataService.allocateMaid(jobId, maidId).subscribe({
      next: () => {
        alert('Allocation successfully completed! A payment prompt of ₹500 has been sent to the employer.');
        delete this.selectedMaids[jobId];
        this.loadData();
      },
      error: (err) => alert('Allocation failed: ' + err.error?.error)
    });
  }

  onDeleteFeedback(id: number): void {
    if (confirm('Are you sure you want to remove this feedback from public records?')) {
      this.dataService.deleteFeedback(id).subscribe({
        next: () => {
          alert('Feedback moderated and removed.');
          this.loadData();
        },
        error: (err) => alert('Failed to delete feedback: ' + err.error?.error)
      });
    }
  }
}
