import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteAdUnitsComponent } from './site-ad-units.component';

describe('SiteAdUnitsComponent', () => {
  let component: SiteAdUnitsComponent;
  let fixture: ComponentFixture<SiteAdUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiteAdUnitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteAdUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
