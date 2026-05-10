import { Injectable } from '@angular/core';
import { Posts } from '../home/posts';

@Injectable({
  providedIn: 'root'
})
export class PostEditService {

  constructor() { }
    private postToEdit: Posts | null = null;

  setPost(post: Posts) {
    this.postToEdit = post;
  }

  getPost(): Posts | null {
    return this.postToEdit;
  }

  clearPost() {
    this.postToEdit = null;
  }
}
