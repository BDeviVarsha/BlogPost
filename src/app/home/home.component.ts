import { Component, HostListener } from '@angular/core';
import { HomeService } from '../services/home.service';
import { Posts } from './posts';
import { Announcement } from './announcement';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  Posts: Posts[] = [];
  page = 1;
  limit = 10;
  totalPosts = 0;
  loading = false;
  // announces: Announcement[] = [];
  pinnedAnnouncements: Announcement[] = [];
  normalAnnouncements: Announcement[] = [];

  constructor(private service: HomeService) { }

  ngOnInit(): void {
    this.loadPosts();
    this.loadAnnounce();
  }

  loadAnnounce() {
    this.service.getAnnouncement().subscribe({
      next: (data) => {
        // this.announces = data;
        this.pinnedAnnouncements = data.filter(a => a.is_Pinned);
        this.normalAnnouncements = data.filter(a => !a.is_Pinned);
    
      },
      error(err) {
        console.log("Failed to load posts", err);
      },
    })
  }

  loadPosts() {
    if (this.loading) return;
    this.loading = true;

    this.service.getPosts(this.page, this.limit).subscribe({
      next: (data) => {
        this.Posts.push(...data.posts);
        this.totalPosts = data.totalPosts;
        this.page++;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load posts', err);
        this.loading = false;
      }
    });
  }

  getFileUrl(filePath?: string): string | undefined {
    return this.service.getFileUrl(filePath);
  }

  getPostFiles(post: Posts): string[] {
    if (!post.filePath) return [];
    return post.filePath.split(',').map(f => f.trim()).filter(f => f);
  }

  getFileName(filePath?: string): string {
    if (!filePath) {
      return '';
    }
    return filePath.split('/').pop() || '';
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

  @HostListener('window:scroll', [])
  onScroll(): void {

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 200;

    // Trigger before reaching bottom
    if (scrollPosition >= threshold && !this.loading) {
      this.loadPosts();
    }
  }
}
