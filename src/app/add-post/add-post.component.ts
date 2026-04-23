import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AddPostService } from '../services/add-post.service';

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
  constructor(private fb: FormBuilder, private service: AddPostService) {
    this.postForm = this.fb.group({
      name: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      file: [null, Validators.required]
    })
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const selectedFile: File = event.target.files[0];
      const allowedTypes = ['audio/mpeg', 'image/png', 'image/jpeg', 'text/plain'];

      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Only mp3, png, jpg or txt files are allowed!');
        this.postForm.patchValue({ file: null });
        return;
      }

      this.postForm.patchValue({ file: selectedFile });
    }
  }
  
  onSubmit() {
    const formData = new FormData();
    
    formData.append('name', this.postForm.get('name')?.value);
    formData.append('title', this.postForm.get('title')?.value);
    formData.append('description', this.postForm.get('description')?.value);

    const file: File = this.postForm.get('file')?.value;
    console.log(this.postForm.value);
    if (file) {
      formData.append('File', file, file.name);
    }
    else {
      console.log("No file uploaded");
    }

    this.service.createPost(formData).subscribe(() => {
      alert('Post created successfully');
      this.postForm.reset();
    })
  }
}
