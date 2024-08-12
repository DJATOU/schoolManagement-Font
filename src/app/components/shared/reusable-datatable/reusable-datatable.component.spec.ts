import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableDatatableComponent } from './reusable-datatable.component';

describe('ReusableDatatableComponent', () => {
  let component: ReusableDatatableComponent;
  let fixture: ComponentFixture<ReusableDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableDatatableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReusableDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
