import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLayoutContainerComponent } from './shared-layout-container.component';

describe('SharedLayoutContainerComponent', () => {
  let component: SharedLayoutContainerComponent;
  let fixture: ComponentFixture<SharedLayoutContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedLayoutContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedLayoutContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
