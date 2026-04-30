import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Posts } from '../home/posts';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  apiUrl = 'https://localhost:7249/api/Home'

  constructor(private http: HttpClient) { }

  getPosts(page: number, limit: number): Observable<{posts: Posts[], totalPosts: number}> {
    return this.http.get<{posts: Posts[], totalPosts: number}>(`${this.apiUrl}/posts?page=${page}&limit=${limit}`);
  }

  getFileUrl(filePath?: string): string | undefined {
    if (!filePath) {
      console.warn('getFileUrl called with undefined filePath');
      return undefined; // or return a placeholder URL if you want
    }

    const fileName = filePath.split('/').pop();
    if (!fileName) {
      console.warn('Could not extract fileName from filePath:', filePath);
      return undefined;
    }
    return `${this.apiUrl}/file/${fileName}`;
  }
  getMyPosts(): Observable<Posts[]> {
    return this.http.get<Posts[]>(`${this.apiUrl}/my-posts`);
  }
}
