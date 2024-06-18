import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorPaymentPageComponent } from './distributor-payment-page.component';

describe('DistributorPaymentPageComponent', () => {
  let component: DistributorPaymentPageComponent;
  let fixture: ComponentFixture<DistributorPaymentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DistributorPaymentPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistributorPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
