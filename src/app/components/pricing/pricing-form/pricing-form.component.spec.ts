import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingFormComponent } from './pricing-form.component';

describe('PricingFormComponent', () => {
  let component: PricingFormComponent;
  let fixture: ComponentFixture<PricingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PricingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
