import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSearchComponent } from './student-search.component';

describe('StudentSearchComponent', () => {
  let component: StudentSearchComponent;
  let fixture: ComponentFixture<StudentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
