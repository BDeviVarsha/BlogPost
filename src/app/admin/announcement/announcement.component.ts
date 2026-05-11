import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AdminService } from 'src/app/services/admin.service';
import { AnnouncementEditService } from 'src/app/services/announcement-edit.service';

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
  editAnnounceId: number | null = null;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder, private adminService: AdminService, private router:Router, private announceEditService: AnnouncementEditService) {
    this.announceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      is_pinned: [false]
    })

    const announce = this.announceEditService.getAnnouncement();
    if (announce) {
      this.isEditMode = true;
      this.editAnnounceId = announce.id;
      this.announceForm.patchValue({
        title: announce.title,
        description: announce.description,
        is_pinned: announce.is_Pinned
      });
    }
  }

  createAnnounce() {
    if (this.editAnnounceId && this.isEditMode) {
      this.adminService.editMyAnnouncements(this.editAnnounceId, this.announceForm.value).subscribe(() => {
        console.log('Announcement Editted Successfully');
        this.announceForm.reset();
        this.editAnnounceId = null;
        this.announceEditService.clearAnnouncement();
      })
      return;
    }

    this.adminService.createAnnouncement(this.announceForm).subscribe(() => {
      console.log('Announcement created successfully');
      this.announceForm.reset();
    })
  }
    cancelEdit() {
    this.announceEditService.clearAnnouncement();
    this.router.navigate(['/Admin/MyAnnouncement']);
  } 

}
