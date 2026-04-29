import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AddPostService } from '../services/add-post.service';
import { AuthService } from '../services/auth.service';

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

  constructor(private fb: FormBuilder, private service: AddPostService) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      file: [null]
    });
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
    const formData = new FormData();
    formData.append('title', this.postForm.get('title')?.value);
    formData.append('description', this.postForm.get('description')?.value);

    // const file: File = this.postForm.get('file')?.value;
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        formData.append('Files', file, file.name);
      });
    } else {
      console.log("No files uploaded");
    }

    this.service.createPost(formData).subscribe(() => {
      alert('Post created successfully');
      this.postForm.reset();
      this.selectedFiles = [];
    })
  }
}
