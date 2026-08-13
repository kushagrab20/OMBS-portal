import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <!-- Hero Section -->
      <div class="row align-items-center mb-5 bg-dark text-white rounded-5 p-5 shadow-lg position-relative overflow-hidden" 
           style="background: linear-gradient(135deg, #1f1c2c 0%, #928dab 100%) !important;">
        <div class="col-lg-7 z-2">
          <span class="badge bg-primary mb-3 px-3 py-2 rounded-pill text-uppercase">Online Maid Bureau System</span>
          <h1 class="display-4 fw-bold mb-3">Find Verified Home Help Effortlessly</h1>
          <p class="lead mb-4 text-light-50">
            Connecting families with professional baby sitters, home cleaners, and cooks. Secure bookings, direct communication, and performance rating tracking.
          </p>
          <div class="d-flex gap-3">
            <a routerLink="/register" class="btn btn-primary btn-lg rounded-pill px-4 shadow-sm">Get Started</a>
            <a href="#search-section" class="btn btn-outline-light btn-lg rounded-pill px-4">Browse Maids</a>
          </div>
        </div>
        <div class="col-lg-5 d-none d-lg-block position-relative">
          <div class="position-absolute bg-primary rounded-circle blur-bg" style="width: 250px; height: 250px; top: -50px; right: -50px; opacity: 0.15; filter: blur(50px);"></div>
          <div class="card bg-glass text-dark border-0 p-4 rounded-4 shadow-lg">
            <h5 class="fw-bold mb-3"><i class="bi bi-shield-check text-primary me-2"></i> Verified Profiles</h5>
            <div class="d-flex align-items-center mb-3">
              <div class="bg-primary text-white rounded-circle p-2 me-3">
                <i class="bi bi-clock-history"></i>
              </div>
              <div>
                <h6 class="mb-0 fw-bold">Wait Time Metrics</h6>
                <small class="text-muted">Real-time job queue tracking</small>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <div class="bg-success text-white rounded-circle p-2 me-3">
                <i class="bi bi-credit-card"></i>
              </div>
              <div>
                <h6 class="mb-0 fw-bold">Secured Escrow</h6>
                <small class="text-muted">Release contact details post-payment</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Section -->
      <div id="search-section" class="card border-0 shadow-sm rounded-4 p-4 mb-5">
        <h3 class="fw-bold mb-4 text-center">Search Available Maid Registrations</h3>
        <div class="row g-3">
          <div class="col-md-5">
            <label class="form-label fw-semibold">Location / Address</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-geo-alt"></i></span>
              <input type="text" class="form-control bg-light border-start-0" 
                     placeholder="e.g. Noida, Bangalore" [(ngModel)]="searchLocation" (ngModelChange)="applyFilter()">
            </div>
          </div>
          <div class="col-md-5">
            <label class="form-label fw-semibold">Maid Specialty / Type</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-person-workspace"></i></span>
              <select class="form-select bg-light border-start-0" [(ngModel)]="searchType" (ngModelChange)="applyFilter()">
                <option value="">All Specialties</option>
                <option value="Baby sitter">Baby sitter</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Cook">Cook</option>
                <option value="All rounder">All rounder</option>
              </select>
            </div>
          </div>
          <div class="col-md-2 d-grid align-items-end">
            <button class="btn btn-dark btn-lg rounded-3 mt-md-0 mt-3" (click)="resetFilters()">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Results Grid -->
      <h4 class="fw-bold mb-4">Available Candidates ({{filteredMaids.length}})</h4>
      <div class="row g-4" *ngIf="filteredMaids.length > 0; else noResults">
        <div class="col-md-4" *ngFor="let maid of filteredMaids">
          <div class="card h-100 border-0 shadow-sm rounded-4 hover-card overflow-hidden">
            <div class="p-4 card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge rounded-pill px-3 py-2" 
                      [ngClass]="maid.status === 'AVAILABLE' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'">
                  {{maid.status}}
                </span>
                <span class="text-muted fw-bold small">ID: {{maid.maidId}}</span>
              </div>
              <h5 class="card-title fw-bold mb-1">{{maid.maidType}}</h5>
              <p class="text-muted mb-3"><i class="bi bi-geo-alt me-1"></i>{{maid.maidAddress}}</p>
              
              <div class="row g-2 mb-3 bg-light rounded-3 p-3 text-center">
                <div class="col-6 border-end">
                  <small class="text-muted d-block">Experience</small>
                  <span class="fw-bold text-dark">{{maid.experienceYears}} Yrs</span>
                </div>
                <div class="col-6">
                  <small class="text-muted d-block">Age</small>
                  <span class="fw-bold text-dark">{{maid.maidAge}} Yrs</span>
                </div>
              </div>

              <div class="mb-3 d-flex justify-content-between align-items-center">
                <span class="text-muted">Expectation</span>
                <span class="fw-bold text-primary">₹{{maid.salaryExpectation}}/mo</span>
              </div>

              <!-- Masked Contact Details -->
              <div class="mt-auto border-top pt-3">
                <div class="bg-warning-subtle text-warning border border-warning-subtle rounded-3 p-2 text-center" *ngIf="!isLoggedIn">
                  <i class="bi bi-lock-fill me-1"></i>
                  <a routerLink="/login" class="text-warning fw-bold text-decoration-none small">Login to view contact</a>
                </div>
                <div class="bg-info-subtle text-info border border-info-subtle rounded-3 p-2 text-center" *ngIf="isLoggedIn">
                  <i class="bi bi-shield-shaded me-1"></i>
                  <span class="fw-semibold small">Contact unlocked post-payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noResults>
        <div class="text-center py-5">
          <i class="bi bi-search text-muted display-1 mb-3 d-block"></i>
          <h5 class="text-muted">No maids found matching the filter criteria.</h5>
          <p class="text-muted-50">Try broadening your location search or selecting a different specialty.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .hover-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .hover-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
    }
    .bg-glass {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
    }
  `]
})
export class HomeComponent implements OnInit {
  maids: any[] = [];
  filteredMaids: any[] = [];
  searchLocation: string = '';
  searchType: string = '';
  isLoggedIn: boolean = false;

  constructor(private dataService: DataService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.dataService.getAllMaids().subscribe({
      next: (data) => {
        this.maids = data || [];
        this.applyFilter();
      },
      error: (err) => console.error('Failed to fetch maids list:', err)
    });
  }

  applyFilter(): void {
    if (!this.maids) return;
    const loc = (this.searchLocation || '').trim().toLowerCase();
    const type = (this.searchType || '').trim().toLowerCase();

    this.filteredMaids = this.maids.filter(maid => {
      const maidAddr = (maid.maidAddress || '').toLowerCase();
      const maidType = (maid.maidType || '').toLowerCase();

      const locationMatch = !loc || maidAddr.includes(loc);
      const isAllRounder = maidType.includes('all rounder') || maidType.includes('all-rounder') || maidType.includes('allrounder');
      const typeMatch = !type || maidType.includes(type) || type.includes(maidType) || isAllRounder;

      return locationMatch && typeMatch;
    });
  }

  resetFilters(): void {
    this.searchLocation = '';
    this.searchType = '';
    this.filteredMaids = this.maids;
  }
}
