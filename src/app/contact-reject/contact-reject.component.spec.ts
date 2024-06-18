import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRejectComponent } from './contact-reject.component';

describe('ContactRejectComponent', () => {
  let component: ContactRejectComponent;
  let fixture: ComponentFixture<ContactRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactRejectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
