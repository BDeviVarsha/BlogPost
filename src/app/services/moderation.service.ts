import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Posts } from '../home/posts';

@Injectable({
  providedIn: 'root'
})
export class ModerationService {
  apiUrl = 'https://localhost:7249/api/Moderation';

  constructor(private http: HttpClient, private auth: AuthService) { }

  getPendingPosts(): Observable<Posts[]> {
    return this.http.get<Posts[]>(`${this.apiUrl}/pending`, {
      headers: { Authorization: `Bearer ${this.auth.getToken()}` }
    });
  }

  approvePost(postId: number) {
    return this.http.post(`${this.apiUrl}/approve/${postId}`, null, {
      headers: { Authorization: `Bearer ${this.auth.getToken()}` }
    });
  }

  rejectPost(postId: number, reason: string) {
    return this.http.post(`${this.apiUrl}/reject/${postId}`, { reason },
      {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` }
      }
    );
  }
}
