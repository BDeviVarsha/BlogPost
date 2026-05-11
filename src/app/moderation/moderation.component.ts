import { Component } from '@angular/core';
import { Posts } from '../Interface/posts';
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

  selectedPostId: number | null = null;
  selectedReason: string = '';
  customReason: string = '';

  reasons: string[] = [
    'Spam',
    'Offensive',
    'Irrelevant',
    'Duplicate',
    'Other'
  ];

  openReject(postId: number) {
    this.selectedPostId = postId;
    this.selectedReason = '';
    this.customReason = '';
  }

  confirmReject(postId: number) {
    let finalReason = this.selectedReason;

    if (this.selectedReason === 'Other') {
      finalReason = this.customReason;
    }

    if (!finalReason) {
      alert('Please select or enter a reason');
      return;
    }

    this.moderationService.rejectPost(postId, finalReason).subscribe(() => {
        this.selectedPostId = null;
        this.loadPendingPosts(); // refresh list
      });
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
    this.moderationService.rejectPost(postId, this.selectedReason).subscribe(() => this.loadPendingPosts());
  }

}
