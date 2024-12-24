import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceHistoryDialogComponent } from './attendance-history-dialog.component';

describe('AttendanceHistoryDialogComponent', () => {
  let component: AttendanceHistoryDialogComponent;
  let fixture: ComponentFixture<AttendanceHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceHistoryDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendanceHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
