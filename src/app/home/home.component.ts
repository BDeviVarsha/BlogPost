import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { Posts } from './posts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  Posts: Posts[] = [];

  constructor(private service: HomeService) { }

  ngOnInit(): void {
    this.service.getPosts().subscribe((data) => {
      this.Posts = data;
    });
  }
  getFileName(filePath?: string): string {
    if (!filePath) {
      return '';
    }
    return filePath.split('/').pop() || '';
    
  }

  getPostFilePath(post: Posts): string | undefined {
    return post.filePath;
  }

  getFileUrl(filePath?: string): string | undefined {
    return this.service.getFileUrl(filePath);
  }

  isImage(fileName?: string): boolean {
    return !!fileName && /\.(png|jpg|jpeg)$/i.test(fileName);
  }

  isAudio(fileName?: string): boolean {
    return !!fileName && /\.mp3$/i.test(fileName);
  }

  isVideo(fileName?: string): boolean {
    return !!fileName && /\.mp4$/i.test(fileName);
  }
}
