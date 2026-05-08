import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css'],
})
export class AnnouncementComponent {

  announceForm: FormGroup;
  public Editor: any = ClassicEditor;
    public editorConfig = {
      toolbar: {
        items: ['bold', 'italic', '|', 'link', '|', 'undo', 'redo', '|', 'heading', '|', 'numberedList', 'bulletedList', '|', 'blockQuote', '|', 'insertTable', '|', 'mediaEmbed']
      }
    };

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.announceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      is_pinned:[false]
    })
  }

  createAnnounce() {
    this.adminService.createAnnouncement(this.announceForm).subscribe(() => {
      console.log('Announcement created successfully');
      this.announceForm.reset();
    })
  }
}
