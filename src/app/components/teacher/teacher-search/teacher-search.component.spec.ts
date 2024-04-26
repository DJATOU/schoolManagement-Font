import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSearchComponent } from './teacher-search.component';

describe('TeacherSearchComponent', () => {
  let component: TeacherSearchComponent;
  let fixture: ComponentFixture<TeacherSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
