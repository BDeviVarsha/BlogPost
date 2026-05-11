import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAnnouncementComponent } from './my-announcement.component';

describe('MyAnnouncementComponent', () => {
  let component: MyAnnouncementComponent;
  let fixture: ComponentFixture<MyAnnouncementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyAnnouncementComponent]
    });
    fixture = TestBed.createComponent(MyAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
