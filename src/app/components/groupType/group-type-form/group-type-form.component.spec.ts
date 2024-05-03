import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTypeFormComponent } from './group-type-form.component';

describe('GroupTypeFormComponent', () => {
  let component: GroupTypeFormComponent;
  let fixture: ComponentFixture<GroupTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupTypeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
