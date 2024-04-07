import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SendInviteComponent } from './send-invite/send-invite.component';
import { AddSiteComponent } from './add-site/add-site.component';
import { AdminAccountsListComponent } from './admin-accounts-list/admin-accounts-list.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountDetailAdminComponent } from './account-detail-admin/account-detail-admin.component';
import { AccountSitesComponent } from './account-sites/account-sites.component';
import { AddAppAdUnitsComponent } from './add-app-ad-units/add-app-ad-units.component';
import { AddSite1Component } from './add-site-1/add-site-1.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SiteAdUnitsComponent } from './site-ad-units/site-ad-units.component';
import { UsersComponent } from './users/users.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { authenticationGuard } from './authentication.guard';
import { HomeComponent } from './home/home.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AddSiteAdUnitsComponent } from './add-site-ad-units/add-site-ad-units.component';
import { AddAppComponent } from './add-app/add-app.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ForgotYourPasswordComponent } from './forgot-your-password/forgot-your-password.component';
import { AccountDetailsAppsComponent } from './account-details-apps/account-details-apps.component';
import { AppsAppAdUnitsListComponent } from './apps-app-ad-units-list/apps-app-ad-units-list.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


const routes: Routes = [
  
  // {path: '', component: AppComponent, canActivate: [authenticationGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full',  },
  { path: 'home' , component: HomeComponent, canActivate: [authenticationGuard]  },
  { path: 'contacts', component: ContactsComponent, canActivate: [authenticationGuard] }, 
  { path: 'add-site', component: AddSiteComponent, canActivate: [authenticationGuard]}, 
  { path: 'add-app', component: AddAppComponent, canActivate: [authenticationGuard] },
  { path: 'admin-accounts-list', component: AdminAccountsListComponent, canActivate: [authenticationGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [authenticationGuard]  },
  { path: 'login', component: LoginComponent },
  { path: 'account-details-apps', component: AccountDetailsAppsComponent, canActivate: [authenticationGuard]},
  // { path: ''},
  { path: 'account-sites', component: AccountSitesComponent, canActivate: [authenticationGuard]},
  { path: 'site-ad-units', component: SiteAdUnitsComponent, canActivate: [authenticationGuard]}, 
  { path: 'apps-app-ad-units-list', component: AppsAppAdUnitsListComponent, canActivate: [authenticationGuard]},
  //{ path: 'account-details', component: AccountDetailsComponent }, //
  { path: 'account-detail-admin', component: AccountDetailAdminComponent, canActivate: [authenticationGuard] }, 
  { path : 'account-sites', component: AccountSitesComponent, canActivate: [authenticationGuard] }, 
  { path: 'add-app-ad-units', component: AddAppAdUnitsComponent, canActivate: [authenticationGuard] }, 
  { path: 'add-site-1', component: AddSite1Component },
  { path: 'add-site-ad-units', component: AddSiteAdUnitsComponent, canActivate: [authenticationGuard] },
  { path: 'profile', component: ProfileComponent , canActivate: [authenticationGuard]},//
  { path: 'change-password', component: ChangePasswordComponent },// password change
  { path: 'send-invite', component: SendInviteComponent, canActivate: [authenticationGuard] },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'site-ad-units', component: SiteAdUnitsComponent, canActivate: [authenticationGuard] }, 
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate:[authenticationGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authenticationGuard] },
  { path:  'user-details', component: UserDetailsComponent, canActivate: [authenticationGuard]},
  { path: 'line-chart', component: LineChartComponent, canActivate: [authenticationGuard] },
  { path: 'forgot-password', component: ForgotYourPasswordComponent},
  //{ path: 'users', component: UsersComponent },//
  { path: 'reset-password/:name', component: ResetPasswordComponent},
  { path: '**', component: UsersComponent, canActivate: [authenticationGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
