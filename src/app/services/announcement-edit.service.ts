import { Injectable } from '@angular/core';
import { Announcement } from '../Interface/announcement';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementEditService {

  constructor() { }

  private announcement: Announcement | null = null;

  setAnnouncement(announce: Announcement) {
    this.announcement = announce;
  }

  getAnnouncement() {
    return this.announcement;
  }
  
  clearAnnouncement() {
    this.announcement = null;
  }
}
