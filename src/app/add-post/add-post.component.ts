import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AddPostService } from '../services/add-post.service';
import { Posts } from '../home/posts';
import { Router } from '@angular/router';
import { PostEditService } from '../services/post-edit.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {
  public Editor: any = ClassicEditor;
  public editorConfig = {
    toolbar: {
      items: ['bold', 'italic', '|', 'link', '|', 'undo', 'redo', '|', 'heading', '|', 'numberedList', 'bulletedList', '|', 'blockQuote', '|', 'insertTable', '|', 'mediaEmbed']
    }
  };
  postForm: FormGroup;
  isAnonymous: boolean = false;
  selectedFiles: File[] = [];
  // Edit mode state
  isEditMode = false;
  editingPost: Posts | null = null;
  
  constructor(private fb: FormBuilder, private service: AddPostService, private postEditService: PostEditService, private router: Router) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      // file: [null]
    });
  }
  ngOnInit() {
    const post = this.postEditService.getPost();
    if (post) {
      this.isEditMode = true;
      this.editingPost = post;
      // Pre-fill the form with existing post data
      this.postForm.patchValue({
        title: post.title,
        description: post.description,
      });
    }
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const allowedTypes = ['audio/mpeg', 'image/png', 'image/jpeg', 'image/jpg', 'video/mp4'];
      this.selectedFiles = [];

      for (let i = 0; i < event.target.files.length; i++) {
        const file: File = event.target.files[i];
        if (!allowedTypes.includes(file.type)) {
          alert('Only mp3, png, jpg, jpeg or mp4 files are allowed!');
          continue; // skip invalid file
        }
        this.selectedFiles.push(file);
      }

      if (this.selectedFiles.length === 0) {
        this.postForm.patchValue({ file: null });
      }
    }
  }

   onSubmit() {
    if (this.isEditMode && this.editingPost) {
      this.handleUpdate();
    } else {
      this.handleCreate();
    }
  }

  private handleCreate() {
    const formData = new FormData();
    formData.append('title', this.postForm.get('title')?.value);
    formData.append('description', this.postForm.get('description')?.value);

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        formData.append('Files', file, file.name);
      });
    }

    this.service.createPost(formData).subscribe(() => {
      alert('Post created successfully');
      this.postForm.reset();
      this.selectedFiles = [];
    });
  }

  private handleUpdate() {
    const formData = new FormData();
    formData.append('title', this.postForm.get('title')?.value);
    formData.append('description', this.postForm.get('description')?.value);

    // Carry over existing file path if no new files selected
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        formData.append('Files', file, file.name);
      });
    } else if (this.editingPost?.filePath) {
      // Keep existing files — send the existing path to backend
      formData.append('existingFilePath', this.editingPost.filePath);
    }

    this.service.updatePost(this.editingPost!.postId, formData).subscribe({
      next: () => {
        alert('Post updated successfully');
        this.postEditService.clearPost();
        this.router.navigate(['/MyPosts']);
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Failed to update post.');
      }
    });
  }

  cancelEdit() {
    this.postEditService.clearPost();
    this.router.navigate(['/MyPosts']);
  } 
}
