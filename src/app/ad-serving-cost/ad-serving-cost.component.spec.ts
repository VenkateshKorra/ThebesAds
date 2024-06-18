import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdServingCostComponent } from './ad-serving-cost.component';

describe('AdServingCostComponent', () => {
  let component: AdServingCostComponent;
  let fixture: ComponentFixture<AdServingCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdServingCostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdServingCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
