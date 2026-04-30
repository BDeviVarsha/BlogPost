import { Component } from '@angular/core';
import { Posts } from 'src/app/home/posts';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  posts: Posts[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.adminService.getAllPosts().subscribe((res: any) => {
      this.posts = res;
    });
  }

  deletePost(id: number) {
    if (confirm('Are you sure?')) {
      this.adminService.deletePost(id).subscribe(() => {
        this.posts = this.posts.filter(p => p.postId !== id);
      });
    }
  }

  approvePost(id: number) {
    this.adminService.approvePost(id).subscribe({
      next: () => {
        const post = this.posts.find(p => p.postId === id);
        if (post)
          post.status = 'Approved';
      },
      error: (err) => {
        console.error('Approve failed', err);
      }
    });
  }

  rejectPost(id: number) {
    this.adminService.rejectPost(id).subscribe(() => {
      const post = this.posts.find(p => p.postId === id);
      if (post) post.status = 'Rejected';
    });
  }
}
