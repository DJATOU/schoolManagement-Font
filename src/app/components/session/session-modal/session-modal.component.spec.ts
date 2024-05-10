import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionModalComponent } from './session-modal.component';

describe('SessionModalComponent', () => {
  let component: SessionModalComponent;
  let fixture: ComponentFixture<SessionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
