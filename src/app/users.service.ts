import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AbstractControl, ValidatorFn } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userData: any;
  private userName: any;
  private publisherID: any;

  private socket!: WebSocket;
  
  setPublisherName ='';
  setPublisherId = '';
  tokenValue='';

  upload_domain='http://localhost/';
  upload_file_limit = 20;

  private jsonUrl = 'assets/country_states.json';



  constructor(private http: HttpClient, private messageService: MessageService, private route: Router) {}

  public logoutUser(token: string) {
    console.log('Entered tokenValid', token);
    
    if(token== 'Invalid token') {
      console.log('Inside logout user service');
      localStorage.clear();
      this.route.navigate(['/login']); 
    }
  }

  connect(url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.socket = new WebSocket(url);
      
      this.socket.onopen = () => {
        resolve();
      };
  
      this.socket.onerror = (error) => {
        reject(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error connecting to websocket'+ error, life: 5000  });
      };
    });
  }

  get_upload_domain() {
    return this.upload_domain;
  }

  get_upload_file_limit() {
    return this.upload_file_limit;
  }

  getToken() {
    this.tokenValue= localStorage.getItem('token') || '';
    return  this.tokenValue
  }

  sendRequest(request: any): Observable<any> {
    return new Observable<any>(observer => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        observer.error(new Error('WebSocket connection not established'));
        return;
      }
  
      this.socket.send(JSON.stringify(request));
  
      this.socket.onmessage = (event) => {
        try {
          const responseData = JSON.parse(event.data);
          observer.next(responseData);
        } catch (error) {
          observer.error(new Error('Invalid response format'));
        }
      };
  
      this.socket.onerror = (error) => {
        observer.error(error);
      };
  
      return () => this.socket.close();
    })
    .pipe(
      catchError(error => throwError(error))
    );
  }
  

  setPublisherNameAndId(Name: any, Id: any): any { //set the name and id of the user from account tables to the localstorage.
    this.setPublisherId=Id;
    localStorage.removeItem('setPublisherId');
    localStorage.removeItem('setPublisherName');
    localStorage.setItem('setPublisherId', Id);
    localStorage.setItem('setPublisherName', Name);
    this.setPublisherName= Name;
    // console.log(`Set Publisher Id is: ${this.setPublisherId}, and Publisher Name is: ${this.setPublisherName}`);
  }

  setUserDetails(Data: any) {  // set User details got from account table to localstorage.
    localStorage.removeItem('userDetails');
    localStorage.setItem('userDetails', Data);
  }

  getUserDetails() {  //get user Details from localstorage to acccess.
    const userDetailsString = localStorage.getItem('userDetails');
    // console.log('userDetailsString', userDetailsString);
    
    return userDetailsString ? JSON.parse(userDetailsString) : null;
  }

  getSelectedPublisherName() {  //get Publishser Id selected by Admin in account table.
    return localStorage.getItem('setPublisherName') ?? null;
  }

  getSelectedPublisherId() {  // get Publisher Id of user selected by Admin in account table.
    return localStorage.getItem('setPublisherId') ?? null;
  }


  getType() {  // get the type from localstorage either Publisher or Admin.
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        this.userData = JSON.parse(userDataString);
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    } else {
      console.warn('No userData found in localStorage');
    }
    return this.userData ? this.userData.Type : null;
  }


  getName() {  //  get The Name of the user from userName localstorage.
    const userNameString = localStorage.getItem('userName');
    if (userNameString) {
      try {
        this.userName = userNameString;
      } catch (error) {
        console.error('Error parsing userName:', error);
      }
    } else {
      console.warn('No userName found in localStorage');
    }
    return this.userName ? this.userName : null;
  }

  getAccountId() {  // get Publisher Id set when the user is logged in.
    const publisher_id = localStorage.getItem('PublisherID');
    if (publisher_id) {
      try {
        this.publisherID = publisher_id;
      } catch (error) {
        console.error('Error parsing Publisher ID:', error);
      }
    } else {
      console.warn('No Publisher ID found in localStorage');
    }
    return this.publisherID ? this.publisherID : null;
  }

  saveUser(Data: any): Observable<any> { //Sign up page data and used in contact to add new contacts and save it in user table this.getToken();
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json', // Adjust content type as needed
    //   'Authorization': `Bearer ${this.tokenValue}`
    // });
    // const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/thebes_ads_save_contacts.php', Data);
  }

  updateContacts(Data: any): Observable<any> { // Update invited status in the contacts table in UI which retrives data from this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/thebes_ads_contacts_update.php', Data, options);
  }


  getContacts(): Observable<any> { //Contact page data retrival from user table
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    
    //return this.http.get('https://tidy-warm-asp.ngrok-free.app/thebes_ads_get_contacts.php', options);
    return this.http.get('http://localhost/apps/thebes_ads_get_contacts.php', options);
  }

  createCompanies(Data: any): Observable<any> { //Send Invite from Account List to create companies
    // console.log('The send Invite in users service: ', Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/ThebisAdsApp/CreateCompanies.php', Data, options);
  }

  getInvite(): Observable<any> { //Get Invite data for Admin account list
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
   
    return this.http.get('http://localhost/apps/thebes_ads_get_invite.php', options);
  }

  save_user_details(Data: any): Observable<any> { //Saves login data and verifies.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post<any>('http://localhost/apps/thebes_ads_login_user_detail_save.php', Data, options);
  }

  get_user_login_details(): Observable<any> { //get data from user_details to verify login, but it's not currently been used.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.get('http://localhost/apps/users/userList.php', options)
  }

  save_admin_account_list(Data: any): Observable<any> { //Saves data to admin_accounts_list table from send_invite component.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post<any>('http://localhost/apps/thebes_ads_save_admin_accounts_list.php', Data, options);
  }

  get_admin_account_list(): Observable<any> { //get data from admin_accounts_list table.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.get('http://localhost/apps/thebes_ads_get_admin_accounts_list.php', options);
  }

  getNetworkId(Data: any): Observable <any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/getNetworkId.php', Data, options);
  }

  checkStatusOfMcm(Data: any): Observable<any> { //check mcm status
    // console.log('Data send to Gam Api for status is: ', Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);

    return this.http.post('http://localhost/apps/ThebisAdsApp/GetChildPublisher.php', Data, options);
  }

  mcm_status_update(Data: any): Observable<any> { //updates mcm status in admin-account-list table
    // console.log('Data sent to admin_account table is: ', Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);

    return this.http.post('http://localhost/apps/admin_mcm_update.php', Data, options);
  }

  revoke_invite(Data: any): Observable<any> { //revoke invite api in admin-account-list
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/ThebisAdsApp/Revoke_Invite.php', Data, options);
  }

  resendInvite(Data: any): Observable<any> { //resend Invite api in admin-account-list
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/ThebisAdsApp/ReInviteUser.php', Data, options);
  }

  createUser(Data: any) { //create user password for login
    // console.log('sent mail for creation is: ', Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/ThebisAdsApp/createUser.php', Data, options);
  }

  disableOption(Data: any): Observable<any> { //Disable user from login to the site. 
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/users/userChangeStatus.php', Data, options);
  }

  disableAccount(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/ThebisAdsApp/DisableOption.php', Data, options);
  }

  updateStatusofDisable(Data: any): Observable<any> { //update disable status in user_detail table.
    // console.log("Data send for Disable status is: ",Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/admin_account_disable_status_update.php', Data, options);
  }

  newChildSite(Data: any): Observable<any> { //creat a new site for the user, using GAM.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/ThebisAdsApp/NewChildSite.php', Data, options);
  }

  addSite(Data: any): Observable<any> { //Add new site created to the sites table.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/add_site.php', Data, options);
  }

  get_add_site(Data: any): Observable<any> { // fetch sites table data for site component.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_add_site.php', Data, options);
  }
  get_user_name(Data: any): Observable<any> { //get user Name to show at usere profile name.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_user_name.php', Data, options);
  }

  deactivateSite(Data: any): Observable<any> { //Deactivate  site in GAM.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/ThebisAdsApp/DeActivatesite.php', Data, options);
  }

  get_add_app(Data: any): Observable<any> { //fetch data from database for app table.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_add_app.php', Data, options);
  }

  newMobileApp(Data: any): Observable<any> { // create new app 
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/ThebisAdsApp/NewMobileApplications.php', Data, options);
  }
  addApp(Data: any): Observable<any> { //Add new app created to the apps table.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/add_app.php', Data, options);
  }

  deactivateApp(Data: any): Observable<any> { //Deactivate app in GAM.
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/ThebisAdsApp/deactivateApp.php', Data, options);
  }

  disableAppStatus(Data: any): Observable<any> {  //disable app status in app table
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/app_status_update.php', Data, options);
  }

  sendSiteAdUnitRequest(Data: any): Observable<any> {  //send create site Ad Unit request
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    // console.log('Data sent is :', Data);
    return this.http.post('http://localhost/apps/ThebisAdsApp/CreateSiteAdunit.php', Data, options);
  }

  addSiteAdUnit(Data: any): Observable<any> { //add data to site ad unit table
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/add_site_ad_units.php', Data, options);
  }

  get_site_ad_units(Data: any): Observable<any> { //get data from site ad unit
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_site_ad_units.php', Data, options);
  }

  get_site_parentAdUnitId(Data: any): Observable<any> { // get parent ad unit from site table
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_site_parent_id.php', Data, options);
  }

  get_app_ad_units(Data: any): Observable<any> {  // get app ad units table data to UI
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_app_ad_units.php', Data, options);
  }

  sendAppAdUnitRequest(Data: any): Observable<any> {  // send app ad unit request
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    // console.log('Data sent is :', Data);
    return this.http.post('http://localhost/apps/ThebisAdsApp/CreateAppAdunit.php', Data, options);
  }

  get_app_parentAdUnitId(Data: any): Observable<any> { // get parent ad unit from app table
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_app_parent_id.php', Data, options);
  }

  getSiteNameAndAccountId(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/getSiteNameAndAccountId.php', Data, options);
  }

  getAppNameAndAccountId(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/getAppNameAndAccountId.php', Data, options);
  }

  addAppAdUnit(Data: any): Observable<any> { //add data to app ad unit table
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/add_app_ad_units.php', Data, options);
  }

  getAdminDashboardDailyData(): Observable<any> { // get data from daily_ad_unti table
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.get('http://localhost/apps/get_admin_dashboard_daily_data.php', options);
  }

  get_daily_ad_unit_wise(): Observable<any> {  //get data from daily_ad_unit_wise
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.get('http://localhost/apps/get_daily_ad_unit_wise.php', options);
  }

  get_adUnits_in_user_dashboard(Data: any): Observable<any> {  // get site adUnits table data 
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_adUnits_for_user_dashboard.php', Data, options);
  }
  sendResetPassword(Data: any): Observable<any> {  //Send password reset mail to user
    // console.log('Data send for reset password is: ', Data);
    // this.getToken();
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json', // Adjust content type as needed
    //   'Authorization': `Bearer ${this.tokenValue}`
    // });
    // const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);

    return this.http.post('http://localhost/apps/ThebisAdsApp/SendResetPassword.php', Data);
  }

  validate_reset_token(Data: any): Observable<any> {  //Send password reset mail to user
    // console.log('Data send for validate reset password is: ', Data);
    // this.getToken();
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json', // Adjust content type as needed
    //   'Authorization': `Bearer ${this.tokenValue}`
    // });
    // const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);

    return this.http.post('http://localhost/apps/ThebisAdsApp/ValidateResetToken.php', Data);
  }

  resetPassword(Data: any): Observable<any> {
    // console.log('Sent Data is: ', Data);
    // this.getToken();
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json', // Adjust content type as needed
    //   'Authorization': `Bearer ${this.tokenValue}`
    // });
    // const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);

    return this.http.post('http://localhost/apps/reset_password.php', Data);
  }

  changePassword(Data: any): Observable<any> {  //Reseting the password 
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/changePassword.php', Data, options);
  }
  // ---------- //

  get_daily_publisher(Data: any): Observable<any> {  //get daily publisher
    // console.log('Data send in daily_publisher is: ', Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_daily_publisher.php', Data, options);
  }

  get_daily_adunit(Data: any): Observable<any> { //get_daily_adUnit
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_daily_adunit.php', Data, options);
  }

  get_daily_site(Data: any): Observable<any> { //get_daily_adUnit
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_daily_site.php', Data, options);
  }

  get_daily_app(Data: any): Observable<any> { //get_daily_adUnit
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_daily_site.php', Data, options);
  }

  // --------------> //
  get_publisher_revenue(Data: any): Observable<any> {   //get daily publisher revenue
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_publisher_revenue.php', Data, options);
  }

  get_publisher_device(Data: any): Observable<any> {  // get daily publisher device
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_publisher_device.php', Data, options);
  }

  get_publisher_country(Data: any): Observable<any> {   // get daily publisher country
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_publisher_country.php', Data, options);
  }

  get_daily_publisher_revenue(Data: any): Observable<any> {   //get daily publisher revenue
    // console.log('Data send in daily_publisher_revenue is: ', Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_daily_publisher_revenue.php', Data, options);
  }

  get_daily_publisher_device(Data: any): Observable<any> {  // get daily publisher device
    // console.log('Data send in daily_publisher_device is: ', Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_daily_publisher_device.php', Data, options);
  }

  get_daily_publisher_country(Data: any): Observable<any> {   // get daily publisher country
    // console.log('Data send in daily_publisher_country is: ', Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_daily_publisher_country.php', Data, options);
  }
  // ----------->> //
  get_adUnit_revenue(Data: any): Observable<any> {  // get adunit revenue
    // console.log('Data send in daily_adunit_revenue is: ', Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_adUnit_revenue.php', Data, options);
  }
  get_adUnit_device(Data: any): Observable<any> {   // get adunit device
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_adUnit_device.php', Data, options);
  }
  get_adUnit_country(Data: any): Observable<any> {   // get adunit country
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_adUnit_country.php', Data, options);
  }
  //----------->>//
  get_site_revenue(Data: any): Observable<any> {   //get site revenue
    // console.log('Data send in daily_site_revenue is: ', Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_site_revenue.php', Data, options);
  }
  get_site_device(Data: any): Observable<any> { // get site device
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_site_device.php', Data, options);
  }
  get_site_country(Data: any): Observable<any> {  //get site country
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_site_country.php', Data, options);
  }
  getAccountNames(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/getAccountNames.php', Data, options);
  }
  getSiteDropdown(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/getSiteDropdown.php', Data, options);
  }

  getAppDropdown(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/getAppDropdown.php', Data, options);
  }

  getPublisherDropdown(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/getPublisherDropdown.php', Data, options);
  }

  get_daily(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_daily.php', Data, options);
  }
  get_publisher(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/Publisher.php', Data, options);
  }

  get_Admin(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/Admin.php', Data, options);
  }

  getSiteTagDetails(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/GetSiteTagDetails.php', Data, options);
  }

  getAppTagDetails(Data: any): Observable<any> {
    console.log('Data in App Tag', Data);
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/GetAppTagDetails.php', Data, options);
  }

  savePaymentInfo(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/save_payment_info.php', Data, options);
  }

  getPaymentInfo(Data: any): Observable<any>{
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_payment_info.php', Data, options);
  } 

  uploadInvoice(Data: any) {
    this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    const formData = new FormData();
    formData.append('invoice_file', Data.selectedFile);
    formData.append('publisher_id', Data.publisher_id);
    formData.append('month', Data.month.toString());
    return this.http.post('http://localhost/apps/upload_invoice.php', formData, options);
}

  getUserPaymentData(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/get_payment.php', Data, options);
  }

  adminpayment(Data: any): Observable <any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/admin_payment.php', Data, options);
  }

  deleteInvoice(filePath: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    // const payload = { filepath: filePath }; // Construct the payload object with 'filepath' key
    return this.http.post('http://localhost/apps/delete_invoice.php', filePath, options);
  }

  updatePaymentInfo(data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post<any>('http://localhost/apps/update_payment_info.php',data, options);
  }

  getPollingRequest(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/getPollingRequest.php', Data, options);
  } 

  requestLatestData(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/ThebisAdsApp/RabbitMQ_new_request.php', Data, options);
  }

  addUserCredentials(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/users/userCreate.php', Data, options);
  }

  userCredentialsEdit(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    return this.http.post('http://localhost/apps/users/userUpdate.php', Data, options);
  }

  getCountries(): Observable<string[]> {
    return this.http.get<any[]>(this.jsonUrl).pipe(
      map(countries => countries.map(country => country.name))
    );
  }

  getStatesByCountryName(countryName: string): Observable<string[]> {
    return this.http.get<any[]>(this.jsonUrl).pipe(
      map(countries => {
        const country = countries.find(c => c.name === countryName);
        return country ? country.states.map((state: any) => state.name) : [];
      })
    );
  }


  //adding user address

  saveUserAddress(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    console.log('Data send for saving address: ', Data);
    
    return this.http.post('http://localhost/apps/save_user_address.php', Data, options);
  }

  getUserAddresses(accountId: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/get_user_address.php', accountId, options);
  }

  delete_user_address(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/delete_user_address.php', Data, options);
  }

  updateUserAddress(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/update_user_address.php', Data, options);
  }


  //adding user contacts

  saveUserContacts(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    console.log('Data send for saving address: ', Data);
    
    return this.http.post('http://localhost/apps/save_user_contacts.php', Data, options);
  }

  getUserContacts(accountId: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/get_user_contacts.php', accountId, options);
  }

  delete_user_contacts(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/delete_user_contacts.php', Data, options);
  }

  updateUserContacts(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/update_user_contacts.php', Data, options);
  }

  get_address_contact(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/get_address_contacts.php', Data, options);
  }

  send_signup_confirmation_mail(Data: any): Observable<any> {
    return this.http.post('http://localhost/apps/ThebisAdsApp/sendSignupConfirmation.php',Data);
  }

  maxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value?.toString() || ""; // Handle empty string case
      const isValid = value.length <= maxLength;
      return isValid ? null : { 'maxLength': { value: control.value } };
    };
  }

  get_user_invoice_data(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/users/paymentInvoice.php', Data, options);
  }

  accessAssignedPublishers(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/users/accessiblePublisherList.php', Data, options);
  }

  sendRejectionEmail(params: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/ThebisAdsApp/contactReject.php', params, options);
     
  }

  get_ad_serving_cost_data(): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.get('http://localhost/apps/users/adServingCostList.php', options);
  }

  add_ad_serving_record(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/users/adServingCostAdd.php',Data, options);
  }

  delete_ad_serving_record(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/users/adServingCostDelete.php', Data, options)
  }

  edit_ad_serving_record(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/users/adServingCostEdit.php', Data, options)
  }

  manager_distributor(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/ManagerDistributor.php', Data, options);
  }

  get_publishers_revenue_info(Data: any): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.post('http://localhost/apps/users/DistributorRevenue.php', Data, options);
  }

  get_receipt_upload(): Observable<any> {
    this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    return this.http.get('http://localhost/apps/users/receiptUploadList.php', options);
  }


  uploadReceipt(Data: any) {
    this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenValue}`
    });
    const options = { headers: headers };
    // console.log('options is: ', options, this.tokenValue);
    const formData = new FormData();
    formData.append('invoice_file', Data.selectedFile);
    formData.append('publisher_id', Data.publisher_id);
    formData.append('month', Data.Month);
    formData.append('year', Data.Year);
    return this.http.post('http://localhost/apps/users/receiptUploadAdd.php', formData, options);
}

delete_receipt_record(Data: any): Observable<any> {
  this.getToken();
  const headers = new HttpHeaders({
    'Content-Type': 'application/json', // Adjust content type as needed
    'Authorization': `Bearer ${this.tokenValue}`
  });
  const options = { headers: headers };
  return this.http.post('http://localhost/apps/users/receiptUploadDelete.php', Data, options);
}



}
