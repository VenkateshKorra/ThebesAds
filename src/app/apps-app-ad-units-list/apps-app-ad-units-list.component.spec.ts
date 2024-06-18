import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsAppAdUnitsListComponent } from './apps-app-ad-units-list.component';

describe('AppsAppAdUnitsListComponent', () => {
  let component: AppsAppAdUnitsListComponent;
  let fixture: ComponentFixture<AppsAppAdUnitsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppsAppAdUnitsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppsAppAdUnitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
