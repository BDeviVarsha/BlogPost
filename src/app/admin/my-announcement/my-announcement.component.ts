import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Announcement } from 'src/app/Interface/announcement';
import { AdminService } from 'src/app/services/admin.service';
import { AnnouncementEditService } from 'src/app/services/announcement-edit.service';

@Component({
  selector: 'app-my-announcement',
  templateUrl: './my-announcement.component.html',
  styleUrls: ['./my-announcement.component.css']
})
export class MyAnnouncementComponent {

  constructor(private service: AdminService, private route: Router, private announceEdit: AnnouncementEditService) { }
  announce: Announcement[] = [];

  ngOnInit() {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    this.service.getMyAnnouncement().subscribe({
      next: (data) => { this.announce = data; },
      error: (err) => { console.error('Failed to load announcements'); },
    })
  }

  deleteAnnounce(id: number) {
    const confirmed = confirm('Are you sure you want to delete this announcement?');
    if (!confirmed) return;
    else {
      this.service.deleteAnnouncements(id).subscribe(() => {
        console.log('Deleted successfully');
      })
    }
  }

  editAnnounce(announce: Announcement) {
    this.announceEdit.setAnnouncement(announce);
    this.route.navigate(['/Admin/Announcement']);
  }

}
