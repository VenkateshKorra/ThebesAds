import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSitesComponent } from './account-sites.component';

describe('AccountSitesComponent', () => {
  let component: AccountSitesComponent;
  let fixture: ComponentFixture<AccountSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSitesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
