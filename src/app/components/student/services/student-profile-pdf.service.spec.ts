import { TestBed } from '@angular/core/testing';

import { StudentProfilePdfService } from './student-profile-pdf.service';

describe('StudentProfilePdfService', () => {
  let service: StudentProfilePdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentProfilePdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
