import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsAppsComponent } from './account-details-apps.component';

describe('AccountDetailsAppsComponent', () => {
  let component: AccountDetailsAppsComponent;
  let fixture: ComponentFixture<AccountDetailsAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountDetailsAppsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountDetailsAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
