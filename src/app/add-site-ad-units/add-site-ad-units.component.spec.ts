import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSiteAdUnitsComponent } from './add-site-ad-units.component';

describe('AddSiteAdUnitsComponent', () => {
  let component: AddSiteAdUnitsComponent;
  let fixture: ComponentFixture<AddSiteAdUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSiteAdUnitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSiteAdUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
