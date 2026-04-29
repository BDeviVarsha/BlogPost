import { Component } from '@angular/core';
import { Posts } from '../home/posts';
import { ModerationService } from '../services/moderation.service';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.css']
})
export class ModerationComponent {
  pendingPosts: Posts[] = [];

  constructor(private moderationService: ModerationService, private service: HomeService) { }

  ngOnInit() {
    this.loadPendingPosts();
  }
  getFileName(filePath?: string): string {
    if (!filePath) {
      return '';
    }
    return filePath.split('/').pop() || '';
  }

  getPostFiles(post: Posts): string[] {
    if (!post.filePath) return [];
    return post.filePath.split(',').map(f => f.trim()).filter(f => f); // remove empty entries
  }

  // getPostFilePath(post: Posts): string | undefined {
  //   return post.filePath;
  // }

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

  loadPendingPosts() {
    this.moderationService.getPendingPosts().subscribe(posts => this.pendingPosts = posts);
  }

  approve(postId: number) {
    this.moderationService.approvePost(postId).subscribe(() => this.loadPendingPosts());
  }

  reject(postId: number) {
    this.moderationService.rejectPost(postId).subscribe(() => this.loadPendingPosts());
  }

}
