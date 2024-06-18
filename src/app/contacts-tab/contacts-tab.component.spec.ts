import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsTabComponent } from './contacts-tab.component';

describe('ContactsTabComponent', () => {
  let component: ContactsTabComponent;
  let fixture: ComponentFixture<ContactsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactsTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
