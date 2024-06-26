import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherNotificationComponent } from './publisher-notification.component';

describe('PublisherNotificationComponent', () => {
  let component: PublisherNotificationComponent;
  let fixture: ComponentFixture<PublisherNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublisherNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublisherNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
