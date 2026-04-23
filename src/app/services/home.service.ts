import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Posts } from '../home/posts';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  apiUrl='https://localhost:7249/api/Home'

  constructor(private http:HttpClient) { }
  
  getPosts(): Observable<Posts[]> {
    return this.http.get<Posts[]>(`${this.apiUrl}/posts`);
  }

  getFileUrl(filePath: string): string {
    const fileName = filePath.split('/').pop();
    return `${this.apiUrl}/file/${fileName}`;
  }

}
