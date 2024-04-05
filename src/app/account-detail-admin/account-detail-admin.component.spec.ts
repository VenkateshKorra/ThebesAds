import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailAdminComponent } from './account-detail-admin.component';

describe('AccountDetailAdminComponent', () => {
  let component: AccountDetailAdminComponent;
  let fixture: ComponentFixture<AccountDetailAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountDetailAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountDetailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
