import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersService } from '../users.service';
import { AddAppsCategory, OtherPlatforms } from '../sign-up-dropdown';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-add-app',
  templateUrl: './add-app.component.html',
  styleUrl: './add-app.component.css'
})
export class AddAppComponent implements OnInit, AfterViewInit {

  account: any;
  app_name = '';
  category = '';
  app_url = '';
  package_name = '';
  store_id="";
  publisher_id : any;
  category_list: any;
  account_names: any;
  accountSelected: any;
  otherPlatformSelected  ='';

  created_by = '';

  selectedPlatformLabel ='';

  android_checkbox: boolean = true;
  ios_checkbox: boolean = false;
  other_checkbox: boolean = false;
  // otherOption_checkbox: boolean = false;

  other_platforms: any;

  @Input() isOpen: boolean = true;

  @Input() selectedName: string | undefined;

  @Output() dialogClosed: EventEmitter<any> = new EventEmitter();


  successApi = false;
  os ='';
  type: any;

  appNameTextLength =false;
  packageNameTextLength = false;
  StoreUrlTextLength = false;

  constructor(private userService: UsersService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.other_platforms = OtherPlatforms;
    this.type = this.userService.getType();
    this.category_list = AddAppsCategory;
    if (this.selectedName && this.type != 'Admin') {
      // console.log("Name is ", this.selectedName);
      this.accountSelected = this.selectedName;
      this.account = this.selectedName;
    }
    
    console.log('Type of user is: ', this.type);

      this.getAccountNames();

  }

  ngAfterViewInit(): void {
    if(this.userService.getType()=='Admin') {
      const receivedUserData = localStorage.getItem('userData');
      if (receivedUserData) {
        const userDataObject = JSON.parse(receivedUserData);
        this.created_by = userDataObject['User_Name'];
        console.log('Received User Name is: ', this.created_by);
      }
    } 
    else {
      this.created_by = this.userService.getName();
      console.log('Received user name is: ', this.created_by);
      
    }
  }

  checkAppNameTextLength() {
    if(this.app_name.length > 500) {
      this.appNameTextLength = true;
    }
    else {
      this.appNameTextLength = false;
    }
  }

  checkPackageNameTextLength() {
    if(this.package_name.length > 500) {
      this.packageNameTextLength = true;
    }
    else {
      this.packageNameTextLength = false;
    }
  }

  checkStoreUrlTextLength() {
    if(this.app_url.length > 1000) {
      this.StoreUrlTextLength = true;
    }
    else {
      this.StoreUrlTextLength = false;
    }
  }
  

  androidCheckbox() {
    this.ios_checkbox = false;
    this.other_checkbox = false;
    this.android_checkbox=true;
    console.log(`Android clicked, android status is : ${this.android_checkbox} and ios status is: ${this.ios_checkbox}, other is ${this.other_checkbox}`);
    

  }
  iosCheckbox() {
    this.android_checkbox= false;
    this.other_checkbox = false;
    this.ios_checkbox = true;
    
    console.log(`IOS clicked, android status is : ${this.android_checkbox} and ios status is: ${this.ios_checkbox}, other is ${this.other_checkbox}`);
  }

  otherCheckbox() {
    this.android_checkbox= false;
    this.ios_checkbox = false;
    this.other_checkbox = true;
    console.log(`IOS clicked, android status is : ${this.android_checkbox} and ios status is: ${this.ios_checkbox}, other is ${this.other_checkbox}`);
  }
  // otherOptionCheckbox() {
  //   console.log('Other clicked');

  // }
  setAccountName() {
    this.account = this.accountSelected.Account_Name;


  }

  onSave(form: any) {
    // console.log('name is: ', this.account);
    if(this.appNameTextLength || this.packageNameTextLength || this.StoreUrlTextLength) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter valid input sizes', life: 5000 });
    }
    // console.log('Other Platform selected is: ', this.otherPlatformSelected);
    // if(this.os=='GOOGLE_PLAY') {
    //   this.selectedPlatformLabel = 'Android';
    // }
    // else if(this.os =='APPLE_ITUNES') {
    //   this.selectedPlatformLabel = 'IOS';
    // }
    // else if(this.os =='AMAZON_FIRETV') {
    //   this.selectedPlatformLabel = 'Amazon';
    // }
    // else if(this.os =='PLAYSTATION') {
    //   this.selectedPlatformLabel = 'Playstation';
    // }
    // else if(this.os =='XBOX') {
    //   this.selectedPlatformLabel = 'Xbox';
    // }
    // else if(this.os =='SAMSUNG_TV') {
    //   this.selectedPlatformLabel = 'Samsung';
    // }
    // else if(this.os =='LG_TV') {
    //   this.selectedPlatformLabel = 'Lg';
    // }
    else {

    if (form.valid) {
      const id= this.userService.getAccountId();
      if(id!='Publisher ID') {
        this.publisher_id = id;
      }
      else {
        this.publisher_id = this.accountSelected.Account_Id;
      }
      this.isOpen = false; // Close the dialog when saving
      // const apiData = {
      //   app_name: this.account,
      //   app_store: this.app_url,

      // }
      if(this.android_checkbox) {
        this.os = 'GOOGLE_PLAY';
        const androidData = {
          app_name: this.app_name,
          app_store_id: this.package_name,
          app_store: 'GOOGLE_PLAY', 
          // publisher_id: this.publisher_id
        }
        console.log('Android Data: ', androidData);   
        this.callNewMobileApp(androidData);
      }
      else if(this.ios_checkbox) {
        this.os = 'APPLE_ITUNES';
        const iosData = {
          app_name: this.app_name, 
          app_store_id: this.store_id, 
          app_store: 'APPLE_ITUNES',
          // publisher_id: this.publisher_id
        }
        console.log('IOS Data: ', iosData);
        this.callNewMobileApp(iosData);
      }
      else {
        this.os = this.otherPlatformSelected;
        const otherPlatformData = {
          app_name: this.app_name,
          app_store_id: this.package_name,
          app_store: this.os, 
          // publisher_id: this.publisher_id

        }
         console.log('Other Data: ', otherPlatformData);
         this.callNewMobileApp(otherPlatformData);
      }

    }
    else {
      // alert('Please fill all details');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all details', life: 5000  });
      this.dialogClosed.emit();
    }
  }
  }

  onCancel() {
    this.isOpen = false; // Close the dialog when canceling
    this.dialogClosed.emit();
  }

  addAppData(Data: any) {  //Add data to add_app table
    console.log('inside addAppData function');
    this.userService.addApp(Data).subscribe(
      (response) => {
        console.log("response from add_app table", response);
        // alert('App is created Successfully!!!');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'App is created Successfully!!!', life: 5000  });
        this.dialogClosed.emit();
        // this.successApi = true;
      },
      (error) => {
        console.log("Error in saving app in add_app", error);
        this.userService.logoutUser(error.error.error);
        // alert('Error in creating App');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in creating App', life: 5000  });
        this.dialogClosed.emit();

      }
    )
  }

  getAccountNames() {
    const Data = {
      type: this.type
    }
    this.userService.getAccountNames(Data).subscribe(
      (response) => {
         const mappedData = response.map((user: any) => ({
            Account_Id: user.Account_Id,
            Account_Name: user['Account_Name'],
            account_id_name : user.Account_Id + '-' + user['Account_Name']
         }));
        // console.log('Sucessful in getting Account Names: ',this.account_names);

        this.account_names = mappedData;
        // console.log('Account names are: ', this.account_names);
        
      }, 
      (error) => {
        // alert('Error: '+ error.error.error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });
      }
    )
  }

  callNewMobileApp(Data: any) { // call nnewchild site 
    console.log('The Data in callNewMobileApp is:  ', Data);

    this.userService.newMobileApp(Data).subscribe(
      (response) => {
        console.log('Response from NewApp is', response);
        if (response && response.length > 0) {
          this.successApi = true;
          console.log('this.successApi is: ', this.successApi);
          // alert(`App with ID: ${response[0].id} created successfully`);
          const formData = {
            account: this.account,
            app_name: this.app_name,
            url: this.app_url,
            os: this.os, 
            categories: this.category,
            app_id: response[0].id,
            package_name: Data.app_store_id,
            status: 'Submitted for Approval',
            mcm_status: response[0].mcm_status, 
            publisher_id: this.publisher_id,
            created_by: this.created_by
            // ad_units: ''
          }
          this.addAppData(formData);
          // this.dialogClosed.emit();

        } else {
          // alert('No app data received.');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'App is not created!!', life: 5000  });
          this.dialogClosed.emit();
        }
      },
      (error) => {
        console.log('Error in adding app', error);
        this.userService.logoutUser(error.error.error);
        // alert('Error: ' + error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });
        this.dialogClosed.emit();
      }
    )
  }




}

