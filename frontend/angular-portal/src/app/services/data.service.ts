import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private gatewayUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // --- Profile Operations ---
  getMaidProfile(maidId: string): Observable<any> {
    return this.http.get(`${this.gatewayUrl}/users/maids/${maidId}`, { headers: this.getHeaders() });
  }

  updateMaidProfile(maidId: string, profile: any): Observable<any> {
    return this.http.put(`${this.gatewayUrl}/users/maids/${maidId}`, profile, { headers: this.getHeaders() });
  }

  getMemberProfile(memberId: string): Observable<any> {
    return this.http.get(`${this.gatewayUrl}/users/members/${memberId}`, { headers: this.getHeaders() });
  }

  updateMemberProfile(memberId: string, profile: any): Observable<any> {
    return this.http.put(`${this.gatewayUrl}/users/members/${memberId}`, profile, { headers: this.getHeaders() });
  }

  getAllMaids(): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/users/maids`);
  }

  // --- Matching / Allocation Operations ---
  createJob(job: any): Observable<any> {
    return this.http.post(`${this.gatewayUrl}/matching/jobs`, job, { headers: this.getHeaders() });
  }

  getAllJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/matching/jobs`, { headers: this.getHeaders() });
  }

  getJobsByMember(memberId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/matching/members/${memberId}/jobs`, { headers: this.getHeaders() });
  }

  getJobsByMaid(maidId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/matching/maids/${maidId}/jobs`, { headers: this.getHeaders() });
  }

  allocateMaid(jobId: number, maidId: string): Observable<any> {
    return this.http.post(`${this.gatewayUrl}/matching/jobs/${jobId}/allocate?maidId=${maidId}`, {}, { headers: this.getHeaders() });
  }

  getSuggestedJobsForMaid(maidId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/users/maids/${maidId}/matching-jobs`, { headers: this.getHeaders() });
  }

  getSuggestedMaidsForMember(memberId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/users/members/${memberId}/matching-maids`, { headers: this.getHeaders() });
  }

  // --- Payment Operations ---
  getPaymentsByMember(memberId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/payments/member/${memberId}`, { headers: this.getHeaders() });
  }

  payFee(transactionId: number): Observable<any> {
    return this.http.post(`${this.gatewayUrl}/payments/${transactionId}/pay`, {}, { headers: this.getHeaders() });
  }

  getPaymentStatus(jobId: number): Observable<any> {
    return this.http.get(`${this.gatewayUrl}/payments/status/${jobId}`, { headers: this.getHeaders() });
  }

  getPaymentHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/payments/history`, { headers: this.getHeaders() });
  }

  // --- Feedback Operations ---
  submitFeedback(feedback: any): Observable<any> {
    return this.http.post(`${this.gatewayUrl}/feedbacks`, feedback, { headers: this.getHeaders() });
  }

  getFeedbacksForUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/feedbacks/user/${userId}`, { headers: this.getHeaders() });
  }

  getAllFeedbacks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/feedbacks`, { headers: this.getHeaders() });
  }

  deleteFeedback(id: number): Observable<any> {
    return this.http.delete(`${this.gatewayUrl}/feedbacks/${id}`, { headers: this.getHeaders() });
  }
}
