import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppAdUnitsComponent } from './add-app-ad-units.component';

describe('AddAppAdUnitsComponent', () => {
  let component: AddAppAdUnitsComponent;
  let fixture: ComponentFixture<AddAppAdUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAppAdUnitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAppAdUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
