import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Announcement } from '../Interface/announcement';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:5090/api/Admin';

  constructor(private http: HttpClient) { }

  getAllPosts() {
    return this.http.get<any>(`${this.baseUrl}/posts`);
  }

  deletePost(id: number, reason: string) {
    return this.http.put(`${this.baseUrl}/posts/${id}/delete`, { reason });
  }

  rejectPost(id: number, reason: string) {
    return this.http.put(`${this.baseUrl}/posts/${id}/reject`, { reason });
  }

  approvePost(id: number) {
    return this.http.put(
      `${this.baseUrl}/posts/${id}/approve`, {});
  }

  createAnnouncement(data:any){
    return this.http.post(`${this.baseUrl}/announcements`, data);
  }
 
  getMyAnnouncement():Observable<Announcement[]>{
    return this.http.get<Announcement[]>(`${this.baseUrl}/myannouncements`);
  }

  editMyAnnouncements(id:number, data:any){
    return this.http.put(`${this.baseUrl}/myannouncements/${id}`, data);
  }

  deleteAnnouncements(id:number){
    return this.http.delete(`${this.baseUrl}/myannouncements/${id}`);
  }

}
