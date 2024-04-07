import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { AddSitesCategory } from '../sign-up-dropdown';


@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrl: './add-site.component.css'
})
export class AddSiteComponent implements OnInit {
  account='';
  site_name='';
  category='';
  site_url='';
  category_list: any;
  publisher_id : any;

  @Input() isOpen: boolean = true;

  @Input() selectedName: string | undefined;

  @Output() dialogClosed: EventEmitter<any> = new EventEmitter();


  successApi= false;
  
  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.category_list =AddSitesCategory;
      if(this.selectedName) {
        console.log("Name is ", this.selectedName);
      this.account = this.selectedName;
      }
  }


  onSave(form: any) {
    if(form.valid) {
      const id= this.userService.getPublisherId();
      if(id!='Publisher ID') {
        this.publisher_id = id;
      }
      else {
        this.publisher_id = this.userService.getSetPublisherId();
      }
    this.isOpen = false; // Close the dialog when saving
    const apiData = {
      name: this.account, 
      url: this.site_url,
      publisher_id: this.publisher_id
    }
     this.callNewChildApi(apiData);
     
  }
  else {
    alert('Please fill all details');
  }
}

  onCancel() {
    this.isOpen = false; // Close the dialog when canceling
    this.dialogClosed.emit();
  }

  addSiteData(Data: any) {  //Add data to add_site table
    console.log('inside addSiteData function');
    this.userService.addSite(Data).subscribe(
      (response) => {
        console.log("response from add_site table", response);
        alert('add site table is updated');
        this.dialogClosed.emit();
        // this.successApi = true;
      }, 
      (error) => {
        console.log("Error in saving site in add_site", error);
        alert('Error in adding to add site table');
        
      }
    )
  }

  callNewChildApi(Data: any) { // call newchild site 
    console.log('The Data in callNewChildApi is:  ', Data);
    
    this.userService.newChildSite(Data).subscribe(
      (response) => {
        console.log('Response from NewChild is', response);
        if (response && response.length > 0) {
          this.successApi = true;
          console.log('this.successApi is: ',  this.successApi);
          alert(`Site with ID: ${response[0].id} and URL: ${response[0].url} was created for child network code: ${response[0].childNetworkCode}.`);
          const formData = {
            account: this.account,
            site_name: this.site_name, 
            url: this.site_url, 
            categories: this.category, 
            site_id: response[0].id, 
            status: 'Submitted for Approval', 
            mcm_status: response[0].mcm_status, 
            publisher_id: Data.publisher_id
            // ad_units: ''
          }
          this.addSiteData(formData);
          this.dialogClosed.emit();
        } else {
          alert('No site data received.');
          this.dialogClosed.emit();
        }
      }, 
      (error) => {
        console.log('Error in adding site', error);
        alert('Error: ' + error.error.error);
        this.dialogClosed.emit();
      }
    )
  }




}
