import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnnouncementComponent } from './announcement/announcement.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [
    DashboardComponent,
    AnnouncementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule
  ]
})
export class AdminModule { }
