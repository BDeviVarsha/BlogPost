import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminGuard } from '../guards/admin.guard';
import { AnnouncementComponent } from './announcement/announcement.component';
import { MyAnnouncementComponent } from './my-announcement/my-announcement.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'Announcement', component: AnnouncementComponent, canActivate: [AdminGuard] },
  { path: 'MyAnnouncement', component: MyAnnouncementComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
