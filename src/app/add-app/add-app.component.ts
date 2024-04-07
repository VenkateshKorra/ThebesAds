import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-add-app',
  templateUrl: './add-app.component.html',
  styleUrl: './add-app.component.css'
})
export class AddAppComponent implements OnInit {

  account = '';
  app_name = '';
  category = '';
  app_url = '';
  package_name = '';
  store_id="";
  publisher_id : any;

  android_checkbox: boolean = true;
  ios_checkbox: boolean = false;
  // otherOption_checkbox: boolean = false;

  @Input() isOpen: boolean = true;

  @Input() selectedName: string | undefined;

  @Output() dialogClosed: EventEmitter<any> = new EventEmitter();


  successApi = false;
  os ='';



  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    if (this.selectedName) {
      console.log("Name is ", this.selectedName);
      this.account = this.selectedName;
    }
  }

  androidCheckbox() {
    this.android_checkbox=true;
    this.ios_checkbox = false;
    console.log(`Android clicked, android status is : ${this.android_checkbox} and ios status is: ${this.ios_checkbox}`);
    

  }
  iosCheckbox() {
    this.android_checkbox= false;
    this.ios_checkbox = true;
    console.log(`IOS clicked, android status is : ${this.android_checkbox} and ios status is: ${this.ios_checkbox}`);
  }
  // otherOptionCheckbox() {
  //   console.log('Other clicked');

  // }





  onSave(form: any) {
    if (form.valid) {
      const id= this.userService.getPublisherId();
      if(id!='Publisher ID') {
        this.publisher_id = id;
      }
      else {
        this.publisher_id = this.userService.getSetPublisherId();
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
          publisher_id: this.publisher_id
        }
        this.callNewMobileApp(androidData);
      }
      if(this.ios_checkbox) {
        this.os = 'APPLE_ITUNES';
        const iosData = {
          app_name: this.app_name, 
          app_store_id: this.store_id, 
          app_store: 'APPLE_ITUNES',
          publisher_id: this.publisher_id

        }
        this.callNewMobileApp(iosData);
      }
    }
    else {
      alert('Please fill all details');
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
        alert('add app table is updated');
        this.dialogClosed.emit();
        // this.successApi = true;
      },
      (error) => {
        console.log("Error in saving app in add_app", error);
        alert('Error in adding to add app table');

      }
    )
  }

  callNewMobileApp(Data: any) { // call nnewchild site 
    console.log('The Data in callNewMobileApp is:  ', Data);

    // this.userService.newMobileApp(Data).subscribe(
    //   (response) => {
    //     console.log('Response from NewApp is', response);
    //     if (response && response.length > 0) {
    //       this.successApi = true;
    //       console.log('this.successApi is: ', this.successApi);
    //       alert(`App with ID: ${response[0].id} created successfully`);
    //       const formData = {
    //         account: this.account,
    //         app_name: this.app_name,
    //         url: this.app_url,
    //         os: this.os, 
    //         categories: this.category,
    //         app_id: response[0].id,
    //         status: 'Submitted for Approval',
    //         mcm_status: response[0].mcm_status, 
    //         publisher_id: Data.publisher_id
    //         // ad_units: ''
    //       }
    //       this.addAppData(formData);
    //       this.dialogClosed.emit();

    //     } else {
    //       alert('No app data received.');
    //       this.dialogClosed.emit();
    //     }
    //   },
    //   (error) => {
    //     console.log('Error in adding app', error);
    //     alert('Error: ' + error.error.error);
    //     this.dialogClosed.emit();
    //   }
    // )
  }




}

