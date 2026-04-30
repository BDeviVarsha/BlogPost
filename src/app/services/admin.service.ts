import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'https://localhost:7249/api/Admin';

  constructor(private http: HttpClient) { }

  getAllPosts() {
    return this.http.get<any>(`${this.baseUrl}/posts`);
  }

  deletePost(id: number) {
    return this.http.delete(`${this.baseUrl}/posts/${id}`);
  }

  rejectPost(id: number) {
    return this.http.put(
      `https://localhost:7249/api/Admin/posts/${id}/reject`,{ });
  }

  approvePost(id: number) {
    return this.http.put(
      `https://localhost:7249/api/Admin/posts/${id}/approve`, {});
  }
}
