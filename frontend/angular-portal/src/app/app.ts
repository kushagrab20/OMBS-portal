import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public authService: AuthService, private router: Router) {}

  get dashboardLink(): string {
    const role = this.authService.getRole();
    if (role === 'ADMIN') return '/admin-dashboard';
    if (role === 'MEMBER') return '/member-dashboard';
    if (role === 'MAID') return '/maid-dashboard';
    return '/';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
