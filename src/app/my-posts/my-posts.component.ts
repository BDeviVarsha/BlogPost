import { Component } from "@angular/core";
import { Posts } from "../home/posts";
import { HomeService } from "../services/home.service";
import { BrowserModule } from "@angular/platform-browser";
import { PostEditService } from "../services/post-edit.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-my-posts",
  templateUrl: "./my-posts.component.html",
  styleUrls: ["./my-posts.component.css"]
})
export class MyPostsComponent {
  myPosts: Posts[] = [];

  constructor(private service: HomeService, private postEditService: PostEditService, private router: Router) { }

  ngOnInit() {
    this.loadMyPosts();
  }

  loadMyPosts() {
    this.service.getMyPosts().subscribe({
      next: (data) => {
        this.myPosts = data;
      },
      error: (err) => {
        console.error("Failed to load posts", err);
      },
    });
  }

  deletePost(post: Posts) {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
    else {
      this.service.deletePost(post.postId).subscribe({
        next: () => {
          this.myPosts = this.myPosts.filter((p) => p.postId !== post.postId);
          console.log("Post deleted successfully:", post);
        },
        error: (err) => {
          console.error("Failed to delete post", err);
        },
      });
    }
  }

   editPost(post: Posts) {
    this.postEditService.setPost(post);       // store the post
    this.router.navigate(['/AddPost']);       // navigate to the form
  }

  getFileName(filePath?: string): string {
    if (!filePath) {
      return "";
    }
    return filePath.split("/").pop() || "";
  }

  getPostFiles(post: Posts): string[] {
    if (!post.filePath) return [];
    return post.filePath
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f); // remove empty entries
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
