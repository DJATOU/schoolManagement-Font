import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProfileComponent } from './group-profile.component';

describe('GroupProfileComponent', () => {
  let component: GroupProfileComponent;
  let fixture: ComponentFixture<GroupProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
