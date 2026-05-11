import { TestBed } from '@angular/core/testing';

import { AnnouncementEditService } from './announcement-edit.service';

describe('AnnouncementEditService', () => {
  let service: AnnouncementEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnouncementEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
