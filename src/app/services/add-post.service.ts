import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddPostService {

  apiUrl='http://localhost:5090/api/AddPost';
  constructor(private http:HttpClient) { }

  createPost(data:any){
    return this.http.post(this.apiUrl, data);
  }
  
}
