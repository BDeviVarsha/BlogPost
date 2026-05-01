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

  selectedPostId: number | null = null;

  // Delete-specific
  selectedDeleteReason: string = '';
  customDeleteReason: string = '';

  // Reject-specific
  selectedRejectReason: string = '';
  customRejectReason: string = '';

  reasons: string[] = ['Spam', 'Offensive', 'Irrelevant', 'Duplicate', 'Other'];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.adminService.getAllPosts().subscribe((res: any) => {
      this.posts = res.filter((p: any) => !p.is_deleted); // hide deleted posts
    });
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
      const post = this.posts.find(p => p.postId === postId);
      if (post) {
        post.is_deleted = true; 
        post.deleted_Reason = finalReason; // make sure the property name matches backend
      }
      this.selectedPostId = null;
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
      const post = this.posts.find(p => p.postId === postId);
      if (post) {
        post.status = 'Rejected';
        // post.rejected_Reason = finalReason; // make sure this matches backend
      }
      this.selectedPostId = null;
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


  // loadPosts() {
  //   this.adminService.getAllPosts().subscribe((res: any) => {
  //     this.posts = res;
  //   });
  // }

  // selectedPostId: number | null = null;
  // selectedReason: string = '';
  // customReason: string = '';

  // reasons: string[] = ['Spam', 'Offensive', 'Irrelevant', 'Duplicate', 'Other'];

  // openDelete(postId: number) {
  //   this.selectedPostId = postId;
  //   this.selectedReason = '';
  //   this.customReason = '';
  // }

  // confirmDelete(postId: number) {
  //   let finalReason = this.selectedReason;

  //   if (this.selectedReason === 'Other') {
  //     finalReason = this.customReason;
  //   }

  //   if (!finalReason) {
  //     alert('Please select or enter a reason');
  //     return;
  //   }

  //   this.adminService.deletePost(postId, finalReason).subscribe(() => {
  //     const post = this.posts.find(p => p.postId === postId);
  //     if (post) {
  //       post.is_deleted = true;
  //       post.deleted_Reason = finalReason;
  //     }
  //     this.selectedPostId = null;
  
  //     this.loadPosts();
  //   });
  // }
  // openReject(postId: number) {
  //   this.selectedPostId = postId;
  //   this.selectedReason = '';
  //   this.customReason = '';
  // }

  // confirmReject(postId: number) {
  //   let finalReason = this.selectedReason;

  //   if (this.selectedReason === 'Other') {
  //     finalReason = this.customReason;
  //   }

  //   if (!finalReason) {
  //     alert('Please select or enter a reason');
  //     return;
  //   }

  //   this.adminService.rejectPost(postId, finalReason).subscribe(() => {
  //     const post = this.posts.find(p => p.postId === postId);
  //     if (post) post.is_deleted = true;  // Optional: hide in UI immediately
  //     this.selectedPostId = null;
  //     this.loadPosts();
  //   });
  // }
  // approvePost(id: number) {
  //   this.adminService.approvePost(id).subscribe({
  //     next: () => {
  //       const post = this.posts.find(p => p.postId === id);
  //       if (post)
  //         post.status = 'Approved';
  //     },
  //     error: (err) => {
  //       console.error('Approve failed', err);
  //     }
  //   });
  // }
}
