import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


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



  constructor(private http: HttpClient, private messageService: MessageService) {}

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

  saveUser(Data: any): Observable<any> { //Sign up page data and used in contact to add new contacts and save it in user table in Database.
    // console.log(Data);
    //return this.http.post('https://tidy-warm-asp.ngrok-free.app/thebes_ads_save_user.php', Data);
    return this.http.post('https://pubhub.tech/api/thebes_ads_save_contacts.php', Data);
  }

  updateContacts(Data: any): Observable<any> { // Update invited status in the contacts table in UI which retrives data from user table in Database.
    return this.http.post('https://pubhub.tech/api/thebes_ads_contacts_update.php', Data);
  }


  getContacts(): Observable<any> { //Contact page data retrival from user table
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json', // Adjust content type as needed
    //   'ngrok-skip-browser-warning': 'true'
    //   Add any other headers you need
    // });

    // Include headers in the options object
    // const options = { headers: headers };
    //return this.http.get('https://tidy-warm-asp.ngrok-free.app/thebes_ads_get_contacts.php', options);
    return this.http.get('https://pubhub.tech/api/thebes_ads_get_contacts.php');
  }

  createCompanies(Data: any): Observable<any> { //Send Invite from Account List to create companies
    // console.log('The send Invite in users service: ', Data);
    //return this.http.post('https://tidy-warm-asp.ngrok-free.app/thebes_ads_save_invite.php', Data);
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/CreateCompanies.php', Data);
  }

  getInvite(): Observable<any> { //Get Invite data for Admin account list
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Adjust content type as needed
      'ngrok-skip-browser-warning': 'true'
      // Add any other headers you need
    });

    // Include headers in the options object
    const options = { headers: headers };
    //return this.http.get('https://tidy-warm-asp.ngrok-free.app/thebes_ads_get_invite.php', options);
    return this.http.get('https://pubhub.tech/api/thebes_ads_get_invite.php');
  }

  save_user_details(Data: any): Observable<any> { //Saves login data and verifies.

    return this.http.post<any>('https://pubhub.tech/api/thebes_ads_login_user_detail_save.php', Data);
  }

  get_user_login_details(): Observable<any> { //get data from user_details to verify login, but it's not currently been used.
    return this.http.get('https://pubhub.tech/api/thebes_ads_login_user_detail_get.php')
  }

  save_admin_account_list(Data: any): Observable<any> { //Saves data to admin_accounts_list table from send_invite component.
    return this.http.post<any>('https://pubhub.tech/api/thebes_ads_save_admin_accounts_list.php', Data);
  }

  get_admin_account_list(): Observable<any> { //get data from admin_accounts_list table.
    return this.http.get('https://pubhub.tech/api/thebes_ads_get_admin_accounts_list.php');
  }

  getNetworkId(Data: any): Observable <any> {
    return this.http.post('https://pubhub.tech/api/getNetworkId.php', Data);
  }

  checkStatusOfMcm(Data: any): Observable<any> { //check mcm status
    // console.log('Data send to Gam Api for status is: ', Data);

    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/GetChildPublisher.php', Data);
  }

  mcm_status_update(Data: any): Observable<any> { //updates mcm status in admin-account-list table
    // console.log('Data sent to admin_account table is: ', Data);

    return this.http.post('https://pubhub.tech/api/admin_mcm_update.php', Data);
  }

  revoke_invite(Data: any): Observable<any> { //revoke invite api in admin-account-list
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/Revoke_Invite.php', Data);
  }

  resendInvite(Data: any): Observable<any> { //resend Invite api in admin-account-list
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/ReInviteUser.php', Data);
  }

  createUser(Data: any) { //create user password for login
    // console.log('sent mail for creation is: ', Data);
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/createUser.php', Data);
  }

  disableOption(Data: any): Observable<any> { //Disable user from login to the site. 
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/DisableOption.php', Data);
  }

  updateStatusofDisable(Data: any): Observable<any> { //update disable status in user_detail table.
    // console.log("Data send for Disable status is: ",Data);
    return this.http.post('https://pubhub.tech/api/admin_account_disable_status_update.php', Data);
  }

  newChildSite(Data: any): Observable<any> { //creat a new site for the user, using GAM.
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/NewChildSite.php', Data);
  }

  addSite(Data: any): Observable<any> { //Add new site created to the sites table.
    return this.http.post('https://pubhub.tech/api/add_site.php', Data);
  }

  get_add_site(Data: any): Observable<any> { // fetch sites table data for site component.
    return this.http.post('https://pubhub.tech/api/get_add_site.php', Data);
  }
  get_user_name(Data: any): Observable<any> { //get user Name to show at usere profile name.
    return this.http.post('https://pubhub.tech/api/get_user_name.php', Data);
  }

  deactivateSite(Data: any): Observable<any> { //Deactivate  site in GAM.
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/DeActivatesite.php', Data);
  }

  get_add_app(Data: any): Observable<any> { //fetch data from database for app table.
    return this.http.post('https://pubhub.tech/api/get_add_app.php', Data);
  }

  newMobileApp(Data: any): Observable<any> { // create new app 
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/NewMobileApplications.php', Data);
  }
  addApp(Data: any): Observable<any> { //Add new app created to the apps table.
    return this.http.post('https://pubhub.tech/api/add_app.php', Data);
  }

  deactivateApp(Data: any): Observable<any> { //Deactivate app in GAM.
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/deactivateApp.php', Data);
  }

  disableAppStatus(Data: any): Observable<any> {  //disable app status in app table
    return this.http.post('https://pubhub.tech/api/app_status_update.php', Data);
  }

  sendSiteAdUnitRequest(Data: any): Observable<any> {  //send create site Ad Unit request
    // console.log('Data sent is :', Data);
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/CreateSiteAdUnit.php', Data);
  }

  addSiteAdUnit(Data: any): Observable<any> { //add data to site ad unit table
    return this.http.post('https://pubhub.tech/api/add_site_ad_units.php', Data);
  }

  get_site_ad_units(Data: any): Observable<any> { //get data from site ad unit
    return this.http.post('https://pubhub.tech/api/get_site_ad_units.php', Data);
  }

  get_site_parentAdUnitId(Data: any): Observable<any> { // get parent ad unit from site table
    return this.http.post('https://pubhub.tech/api/get_site_parent_id.php', Data);
  }

  get_app_ad_units(Data: any): Observable<any> {  // get app ad units table data to UI
    return this.http.post('https://pubhub.tech/api/get_app_ad_units.php', Data);
  }

  sendAppAdUnitRequest(Data: any): Observable<any> {  // send app ad unit request
    // console.log('Data sent is :', Data);
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/CreateAppAdunit.php', Data);
  }

  get_app_parentAdUnitId(Data: any): Observable<any> { // get parent ad unit from app table
    return this.http.post('https://pubhub.tech/api/get_app_parent_id.php', Data);
  }

  getSiteNameAndAccountId(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/getSiteNameAndAccountId.php', Data);
  }

  getAppNameAndAccountId(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/getAppNameAndAccountId.php', Data);
  }

  addAppAdUnit(Data: any): Observable<any> { //add data to app ad unit table
    return this.http.post('https://pubhub.tech/api/add_app_ad_units.php', Data);
  }

  getAdminDashboardDailyData(): Observable<any> { // get data from daily_ad_unti table
    return this.http.get('https://pubhub.tech/api/get_admin_dashboard_daily_data.php');
  }

  get_daily_ad_unit_wise(): Observable<any> {  //get data from daily_ad_unit_wise
    return this.http.get('https://pubhub.tech/api/get_daily_ad_unit_wise.php');
  }

  get_adUnits_in_user_dashboard(Data: any): Observable<any> {  // get site adUnits table data 
    return this.http.post('https://pubhub.tech/api/get_adUnits_for_user_dashboard.php', Data);
  }
  sendResetPassword(Data: any): Observable<any> {  //Send password reset mail to user
    // console.log('Data send for reset password is: ', Data);

    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/SendResetPassword.php', Data);
  }

  validate_reset_token(Data: any): Observable<any> {  //Send password reset mail to user
    // console.log('Data send for validate reset password is: ', Data);

    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/ValidateResetToken.php', Data);
  }

  resetPassword(Data: any): Observable<any> {
    // console.log('Sent Data is: ', Data);

    return this.http.post('https://pubhub.tech/api/reset_password.php', Data);
  }

  changePassword(Data: any): Observable<any> {  //Reseting the password 
    return this.http.post('https://pubhub.tech/api/changePassword.php', Data);
  }
  // ---------- //

  get_daily_publisher(Data: any): Observable<any> {  //get daily publisher
    // console.log('Data send in daily_publisher is: ', Data);
    return this.http.post('https://pubhub.tech/api/get_daily_publisher.php', Data);
  }

  get_daily_adunit(Data: any): Observable<any> { //get_daily_adUnit
    return this.http.post('https://pubhub.tech/api/get_daily_adunit.php', Data);
  }

  get_daily_site(Data: any): Observable<any> { //get_daily_adUnit
    return this.http.post('https://pubhub.tech/api/get_daily_site.php', Data);
  }

  get_daily_app(Data: any): Observable<any> { //get_daily_adUnit
    return this.http.post('https://pubhub.tech/api/get_daily_site.php', Data);
  }

  // --------------> //
  get_publisher_revenue(Data: any): Observable<any> {   //get daily publisher revenue
    return this.http.post('https://pubhub.tech/api/get_publisher_revenue.php', Data);
  }

  get_publisher_device(Data: any): Observable<any> {  // get daily publisher device
    return this.http.post('https://pubhub.tech/api/get_publisher_device.php', Data);
  }

  get_publisher_country(Data: any): Observable<any> {   // get daily publisher country
    return this.http.post('https://pubhub.tech/api/get_publisher_country.php', Data);
  }

  get_daily_publisher_revenue(Data: any): Observable<any> {   //get daily publisher revenue
    // console.log('Data send in daily_publisher_revenue is: ', Data);
    return this.http.post('https://pubhub.tech/api/get_daily_publisher_revenue.php', Data);
  }

  get_daily_publisher_device(Data: any): Observable<any> {  // get daily publisher device
    // console.log('Data send in daily_publisher_device is: ', Data);
    return this.http.post('https://pubhub.tech/api/get_daily_publisher_device.php', Data);
  }

  get_daily_publisher_country(Data: any): Observable<any> {   // get daily publisher country
    // console.log('Data send in daily_publisher_country is: ', Data);
    return this.http.post('https://pubhub.tech/api/get_daily_publisher_country.php', Data);
  }
  // ----------->> //
  get_adUnit_revenue(Data: any): Observable<any> {  // get adunit revenue
    // console.log('Data send in daily_adunit_revenue is: ', Data);
    return this.http.post('https://pubhub.tech/api/get_adUnit_revenue.php', Data);
  }
  get_adUnit_device(Data: any): Observable<any> {   // get adunit device
    return this.http.post('https://pubhub.tech/api/get_adUnit_device.php', Data);
  }
  get_adUnit_country(Data: any): Observable<any> {   // get adunit country
    return this.http.post('https://pubhub.tech/api/get_adUnit_country.php', Data);
  }
  //----------->>//
  get_site_revenue(Data: any): Observable<any> {   //get site revenue
    // console.log('Data send in daily_site_revenue is: ', Data);
    return this.http.post('https://pubhub.tech/api/get_site_revenue.php', Data);
  }
  get_site_device(Data: any): Observable<any> { // get site device
    return this.http.post('https://pubhub.tech/api/get_site_device.php', Data);
  }
  get_site_country(Data: any): Observable<any> {  //get site country
    return this.http.post('https://pubhub.tech/api/get_site_country.php', Data);
  }
  getAccountNames(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/getAccountNames.php', Data);
  }
  getSiteDropdown(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/getSiteDropdown.php', Data);
  }

  getAppDropdown(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/getAppDropdown.php', Data);
  }

  getPublisherDropdown(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/getPublisherDropdown.php', Data);
  }

  get_daily(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/get_daily.php', Data);
  }
  get_publisher(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/Publisher.php', Data);
  }

  get_Admin(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/Admin.php', Data);
  }

  getSiteTagDetails(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/GetSiteTagDetails.php', Data);
  }

  getAppTagDetails(Data: any): Observable<any> {
    console.log('Data in App Tag', Data);
    return this.http.post('https://pubhub.tech/api/GetAppTagDetails.php', Data);
  }

  savePaymentInfo(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/save_payment_info.php', Data);
  }

  getPaymentInfo(Data: any): Observable<any>{
    return this.http.post('https://pubhub.tech/api/get_payment_info.php', Data);
  } 

  uploadInvoice(Data: any) {
    const formData = new FormData();
    formData.append('invoice_file', Data.selectedFile);
    formData.append('publisher_id', Data.publisher_id);
    formData.append('month', Data.month.toString());
    return this.http.post('https://pubhub.tech/api/upload_invoice.php', formData);
}

  getUserPaymentData(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/get_payment.php', Data);
  }

  adminpayment(Data: any): Observable <any> {
    return this.http.post('https://pubhub.tech/api/admin_payment.php', Data);
  }

  deleteInvoice(filePath: any): Observable<any> {
    // const payload = { filepath: filePath }; // Construct the payload object with 'filepath' key
    return this.http.post('https://pubhub.tech/api/delete_invoice.php', filePath);
  }

  updatePaymentInfo(data: any): Observable<any> {
    return this.http.post<any>('https://pubhub.tech/api/update_payment_info.php',data);
  }

  getPollingRequest(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/getPollingRequest.php', Data);
  } 

  requestLatestData(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/ThebisAdsApp/RabbitMQ_new_request.php', Data);
  }

  addUserCredentials(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/addUserCredentials.php', Data);
  }

  userCredentialsEdit(Data: any): Observable<any> {
    return this.http.post('https://pubhub.tech/api/editUserCredentials.php', Data);
  }

}
