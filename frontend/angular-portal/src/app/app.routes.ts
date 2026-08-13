import { Routes } from '@angular/router';
import { HomeComponent } from './components/home';
import { LoginComponent } from './components/login';
import { RegisterComponent } from './components/register';
import { MemberDashboardComponent } from './components/member-dashboard';
import { MaidDashboardComponent } from './components/maid-dashboard';
import { AdminDashboardComponent } from './components/admin-dashboard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'member-dashboard', component: MemberDashboardComponent },
  { path: 'maid-dashboard', component: MaidDashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];
