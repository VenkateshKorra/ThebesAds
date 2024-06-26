import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationMessageDialogComponent } from './notification-message-dialog.component';

describe('NotificationMessageDialogComponent', () => {
  let component: NotificationMessageDialogComponent;
  let fixture: ComponentFixture<NotificationMessageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationMessageDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
