import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FormsModule } from '@angular/forms';
import { ContactsComponent } from './contacts/contacts.component';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SendInviteComponent } from './send-invite/send-invite.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatIconModule } from '@angular/material/icon';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MenuComponent } from './menu/menu.component';
import { AddSiteComponent } from './add-site/add-site.component';
import { AddSiteAdUnitsComponent } from './add-site-ad-units/add-site-ad-units.component';
import { AddAppAdUnitsComponent } from './add-app-ad-units/add-app-ad-units.component';
import { AccountDetailAdminComponent } from './account-detail-admin/account-detail-admin.component';
import { AddSite1Component } from './add-site-1/add-site-1.component';
import { AccountsComponent } from './accounts/accounts.component';
import {MatTabsModule} from '@angular/material/tabs';
import { AccountSitesComponent } from './account-sites/account-sites.component';
import { SiteAdUnitsComponent } from './site-ad-units/site-ad-units.component';
import { AdminAccountsListComponent } from './admin-accounts-list/admin-accounts-list.component';
import { AccountDetailsAppsComponent } from './account-details-apps/account-details-apps.component';
import { AppsAppAdUnitsListComponent } from './apps-app-ad-units-list/apps-app-ad-units-list.component';
import { AppsAppMCMComponent } from './apps-app-mcm/apps-app-mcm.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AddAppComponent } from './add-app/add-app.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ForgotYourPasswordComponent } from './forgot-your-password/forgot-your-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportDownloadComponent } from './report-download/report-download.component';
import { ThousandSuffixesPipe } from './pipe';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';
import { DownloadInvoiceComponent } from './download-invoice/download-invoice.component';
import { AdminPaymentComponent } from './admin-payment/admin-payment.component';
import { PaymentComponent } from './payment/payment.component';
import { MessagesModule } from "primeng/messages";
import { AddressTabComponent } from './address-tab/address-tab.component'; 
import { ReactiveFormsModule } from '@angular/forms';
import { ContactsTabComponent } from './contacts-tab/contacts-tab.component';
import { ContactRejectComponent } from './contact-reject/contact-reject.component';
import { AdServingCostComponent } from './ad-serving-cost/ad-serving-cost.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { TopPerformersComponent } from './top-performers/top-performers.component';
import { DistributorPaymentPageComponent } from './distributor-payment-page/distributor-payment-page.component';
import { ReceiptUploadComponent } from './receipt-upload/receipt-upload.component';
import { NotificationDashboardAdminComponent } from './notification-dashboard-admin/notification-dashboard-admin.component';
import { PublisherNotificationComponent } from './publisher-notification/publisher-notification.component';
import { NotificationMessageDialogComponent } from './notification-message-dialog/notification-message-dialog.component';







@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    ContactsComponent,
    SendInviteComponent,
    ChangePasswordComponent,
    AccountDetailsComponent,
    ProfileComponent,
    UsersComponent,
    MenuComponent,
    AddSiteComponent,
    AddSiteAdUnitsComponent,
    AddAppAdUnitsComponent,
    AccountDetailAdminComponent,
    AddSite1Component,
    AccountsComponent,
    AccountSitesComponent,
    SiteAdUnitsComponent,
    AdminAccountsListComponent,
    AccountDetailsAppsComponent,
    AppsAppAdUnitsListComponent,
    AppsAppMCMComponent,
    PaymentDetailsComponent,
    LoginComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    NavComponent,
    HomeComponent,
    UserDetailsComponent,
    AddAppComponent,
    LineChartComponent,
    ForgotYourPasswordComponent,
    ResetPasswordComponent,
    ReportDownloadComponent, 
    ThousandSuffixesPipe, ContactDialogComponent, DownloadInvoiceComponent, AdminPaymentComponent, PaymentComponent, AddressTabComponent, ContactsTabComponent, ContactRejectComponent, AdServingCostComponent, TopPerformersComponent, DistributorPaymentPageComponent, ReceiptUploadComponent, NotificationDashboardAdminComponent, PublisherNotificationComponent, NotificationMessageDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    MatFormField, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule, 
    BrowserAnimationsModule, 
    MatIconModule, 
    HttpClientModule, 
    MatTabsModule,
    ResetPasswordModule, 
    MatSelectModule, 
    MatFormFieldModule,
    MatTooltipModule,
    MatButtonModule, 
    NgSelectModule,
    ToastModule, 
    MessagesModule, 
    ReactiveFormsModule,
    NgxCaptchaModule
    

  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
