import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistoryDialogComponent } from './payment-history-dialog.component';

describe('PaymentHistoryDialogComponent', () => {
  let component: PaymentHistoryDialogComponent;
  let fixture: ComponentFixture<PaymentHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentHistoryDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
