import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsAppMCMComponent } from './apps-app-mcm.component';

describe('AppsAppMCMComponent', () => {
  let component: AppsAppMCMComponent;
  let fixture: ComponentFixture<AppsAppMCMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppsAppMCMComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppsAppMCMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
