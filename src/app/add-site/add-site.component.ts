import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { UsersService } from '../users.service';
import { AddAppsCategory, AddSitesCategory } from '../sign-up-dropdown';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrl: './add-site.component.css'
})
export class AddSiteComponent implements OnInit, AfterViewInit {
  account = '';
  site_name = '';
  category = '';
  site_url = '';
  category_list: any;
  publisher_id: any;
  position: TooltipPosition = 'right';

  accountDataArray: any;

  accoutNameSelected: any;
  accountIdSelected: any;

  created_by = '';
  account_selected: any;


  siteNameTextLength = false;
  siteUrlTextLength = false;


  @Input() isOpen: boolean = true;

  @Input() selectedName: string | undefined;

  @Output() dialogClosed: EventEmitter<any> = new EventEmitter();


  successApi = false;

  constructor(private userService: UsersService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.category_list = AddAppsCategory;
    if (this.selectedName) {
      console.log("Name is ", this.selectedName);
      this.account = this.selectedName;
    }
    this.fetchData();
  }

  ngAfterViewInit(): void {
    if (this.userService.getType() == 'Admin') {
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

  // fetchData() {
  //   this.userService.get_admin_account_list().subscribe(
  //     (response) => {
  //       const mappedData  = response.map((user: any) => ({
  //         account_id: user.Account_Id,
  //         account_name: user['Account_Name'],
  //         account_id_name : user.Account_Id + '-' + user['Account_Name']
  //       }));
  //       console.log('mapped data is: ',  mappedData);

  //       this.accountDataArray = mappedData;


  //     }, 
  //     (error) => {
  //       console.log('error in getting account id and name', error);
  //     }
  //   )
  // }

  checkSiteNameTextLength() {
    if (this.site_name.length > 500) {
      this.siteNameTextLength = true;
    }
    else {
      this.siteNameTextLength = false;
    }
  }

  checkSiteUrlTextLength() {
    if (this.site_url.length > 1000) {
      this.siteUrlTextLength = true;
    }
    else {
      this.siteUrlTextLength = false;
    }
  }

  fetchData() {
    const Data = {
      type: this.userService.getType()
    }
    this.userService.getAccountNames(Data).subscribe(
      (response) => {
        const mappedData = response.map((user: any) => ({
          account_id: user.Account_Id,
          account_name: user['Account_Name'],
          account_id_name: user.Account_Id + '-' + user['Account_Name']
        }));
        // console.log('mapped data is: ',  mappedData);

        this.accountDataArray = mappedData;
        // console.log('Sucessful in getting Account Names: ',this.accountDataArray);
      },
      (error) => {
        // alert('Error: '+ error.error.error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
      }
    )
  }

  setNameAndId() {
    console.log('ngModel data is: ', this.account_selected);
    this.accoutNameSelected = this.account_selected.account_name;
    this.accountIdSelected = this.account_selected.account_id

    // console.log('Name and Id is: ', this.accoutNameSelected, this.accountIdSelected);



  }




  onSave(form: any) {
    if (this.siteNameTextLength || this.siteUrlTextLength) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter valid input sizes', life: 5000 });
    }
    else {
      if (form.valid) {
        const id = this.userService.getAccountId();
        if (id != 'Publisher ID') {
          this.publisher_id = id;
        }
        else {
          this.publisher_id = this.userService.getSelectedPublisherId();
        }
        this.isOpen = false; // Close the dialog when saving
        const apiData = {
          name: this.accoutNameSelected,
          url: this.site_url,
          publisher_id: this.accountIdSelected
        }
        // console.log('category', this.category);

        // console.log('Api Data is: ', apiData);

        this.callNewChildApi(apiData);
      }
      else {
        // alert('Please fill all details');

        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all details', life: 5000 });

      }
    }
  }

  onCancel() {
    this.isOpen = false; // Close the dialog when canceling
    this.dialogClosed.emit();
  }

  addSiteData(Data: any) {  //Add data to add_site table
    // console.log('inside addSiteData function');
    this.userService.addSite(Data).subscribe(
      (response) => {
        // console.log("response from add_site table", response);
        // alert('Site is created Successfully!!!');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Site is created Successfully!!!', life: 5000 });
        this.dialogClosed.emit();
        // this.successApi = true;
      },
      (error) => {
        console.log("Error in saving site in add_site", error);
        this.userService.logoutUser(error.error.error);
        // alert('Error in creating Site');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in creating Site' + error.error.error, life: 5000 });
        this.dialogClosed.emit();

      }
    )
  }

  callNewChildApi(Data: any) { // call newchild site 
    // console.log('The Data in callNewChildApi is:  ', Data);

    this.userService.newChildSite(Data).subscribe(
      (response) => {
        // console.log('Response from NewChild is', response);
        if (response && response.length > 0) {
          this.successApi = true;
          console.log('this.successApi is: ', this.successApi);
          // alert(`Site with ID: ${response[0].id} and URL: ${response[0].url} was created for child network code: ${response[0].childNetworkCode}.`);
          const formData = {
            account: this.accoutNameSelected,
            site_name: this.site_name,
            url: this.site_url,
            categories: this.category,
            site_id: response[0].id,
            status: 'Submitted for Approval',
            mcm_status: response[0].mcm_status,
            publisher_id: Data.publisher_id,
            created_by: this.created_by
            // ad_units: ''
          }
          this.addSiteData(formData);
          // this.dialogClosed.emit();
        } else {
          // alert('No site data received.');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in creating site!!', life: 5000 });
          this.dialogClosed.emit();
        }
      },
      (error) => {
        console.log('Error in adding site', error);
        this.userService.logoutUser(error.error.error);
        // alert('Error: ' + error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in creating Site' + error.error.error, life: 5000 });
        this.dialogClosed.emit();
      }
    )
  }
}
