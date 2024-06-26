import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDashboardAdminComponent } from './notification-dashboard-admin.component';

describe('NotificationDashboardAdminComponent', () => {
  let component: NotificationDashboardAdminComponent;
  let fixture: ComponentFixture<NotificationDashboardAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationDashboardAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationDashboardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
