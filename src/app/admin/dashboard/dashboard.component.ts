import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Posts } from 'src/app/Interface/posts';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  posts: Posts[] = [];

  selectedPostId: number | null = null;

  // Delete-specific
  selectedDeleteReason: string = '';
  customDeleteReason: string = '';

  // Reject-specific
  selectedRejectReason: string = '';
  customRejectReason: string = '';

  reasons: string[] = ['Spam', 'Offensive', 'Irrelevant', 'Duplicate', 'Other'];

  constructor(private adminService: AdminService, private route:Router) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.adminService.getAllPosts().subscribe((res: any) => {
      this.posts = res;
    });
  }

  create(){
    this.route.navigate(['/Admin/Announcement']);
  }

  myAnnounce(){
    this.route.navigate(['/Admin/MyAnnouncement']);
  }

  // ---------------- Delete -----------------
  openDelete(postId: number) {
    this.selectedPostId = postId;
    this.selectedDeleteReason = '';
    this.customDeleteReason = '';
  }

  confirmDelete(postId: number) {
    let finalReason = this.selectedDeleteReason;
    if (this.selectedDeleteReason === 'Other') {
      finalReason = this.customDeleteReason;
    }

    if (!finalReason) {
      alert('Please select or enter a reason');
      return;
    }

    this.adminService.deletePost(postId, finalReason).subscribe(() => {
      this.loadPosts();
    });
  }

  // ---------------- Reject -----------------
  openReject(postId: number) {
    this.selectedPostId = postId;
    this.selectedRejectReason = '';
    this.customRejectReason = '';
  }

  confirmReject(postId: number) {
    let finalReason = this.selectedRejectReason;
    if (this.selectedRejectReason === 'Other') {
      finalReason = this.customRejectReason;
    }

    if (!finalReason) {
      alert('Please select or enter a reason');
      return;
    }

    this.adminService.rejectPost(postId, finalReason).subscribe(() => {
      this.loadPosts();
    });
  }

  // ---------------- Approve -----------------
  approvePost(postId: number) {
    this.adminService.approvePost(postId).subscribe(() => {
      const post = this.posts.find(p => p.postId === postId);
      if (post) post.status = 'Approved';
    });
  }
}
