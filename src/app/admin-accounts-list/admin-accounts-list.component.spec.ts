import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountsListComponent } from './admin-accounts-list.component';

describe('AdminAccountsListComponent', () => {
  let component: AdminAccountsListComponent;
  let fixture: ComponentFixture<AdminAccountsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAccountsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAccountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
