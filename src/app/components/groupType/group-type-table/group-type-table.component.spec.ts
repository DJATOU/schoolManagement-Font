import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTypeTableComponent } from './group-type-table.component';

describe('GroupTypeTableComponent', () => {
  let component: GroupTypeTableComponent;
  let fixture: ComponentFixture<GroupTypeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupTypeTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
