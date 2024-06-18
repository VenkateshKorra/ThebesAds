import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSite1Component } from './add-site-1.component';

describe('AddSite1Component', () => {
  let component: AddSite1Component;
  let fixture: ComponentFixture<AddSite1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSite1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSite1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
