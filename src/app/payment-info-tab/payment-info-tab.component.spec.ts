import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInfoTabComponent } from './payment-info-tab.component';

describe('PaymentInfoTabComponent', () => {
  let component: PaymentInfoTabComponent;
  let fixture: ComponentFixture<PaymentInfoTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentInfoTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentInfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
