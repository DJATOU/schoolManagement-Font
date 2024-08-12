import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectTableComponent } from './subject-table.component';

describe('SubjectTableComponent', () => {
  let component: SubjectTableComponent;
  let fixture: ComponentFixture<SubjectTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubjectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
