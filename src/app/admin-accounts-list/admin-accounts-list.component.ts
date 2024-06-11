import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersService } from '../users.service';
import { isPlatformBrowser } from '@angular/common';
import { countries } from '../sign-up-dropdown';
import { StatusOptions } from '../admin-dashboard-dropdown';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-accounts-list',
  templateUrl: './admin-accounts-list.component.html',
  styleUrl: './admin-accounts-list.component.css'
})
export class AdminAccountsListComponent implements AfterViewInit, OnInit {

  selectedSymbol = '';
  selectedCountry = '';
  inviteSend = false;
  countries_list: any;
  status_options: any;
  // actionButton=false;

  @ViewChild('status') status!: ElementRef;
  @ViewChild('country') country!: ElementRef;

  displayedColumns: string[] = [ 'publisher_id','publisher_name', 'network_id', 'status', 'mcm_status', 'country', 'margin', 'sites', 'apps','email', 'phone', 'gross', 'approved_on', 'created_on', 'created_by', 'action'];
  dataSource = new MatTableDataSource<Accounts>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UsersService, @Inject(PLATFORM_ID) private platformId: Object, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    this.status_options=StatusOptions;
    this.countries_list = countries;
    // Fetch and display admin-accounts-list when component initializes
    if (isPlatformBrowser(this.platformId)) {
      this.fetchData();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  clearSearch() {
    // Clear the input field
    const searchInput = document.getElementById('search') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }

    // Clear the selected status in the dropdown
    this.selectedSymbol = '';
    if (this.status && this.status.nativeElement) {
      this.status.nativeElement.value = '';
    }

    // Clear the selected country in the dropdown (if applicable)
    // Uncomment this block if you have a country dropdown
    this.selectedCountry = '';
    if (this.country && this.country.nativeElement) {
      this.country.nativeElement.value = '';
    }

    // Apply all filters with empty values
    this.applyAllFilters();
}


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      console.log("The filter is", this.dataSource.filter);
    }
  }

  applyFilterByStatus(symbol: string) {
    // Update selectedSymbol
    this.selectedSymbol = symbol;

    // Apply filters
    console.log('Status is : ', this.selectedSymbol);
    this.applyAllFilters();
  }

  applyFilterByCountry(symbol: string) {
    // Update selectedCountry
    this.selectedCountry = symbol;

    // Apply filters
    console.log('Country is : ', this.selectedCountry);
    this.applyAllFilters();
  }

  applyAllFilters() {
    // Combine status and country filters
    const statusFilter = this.selectedSymbol.trim().toLowerCase();
    const countryFilter = this.selectedCountry.trim().toLowerCase();

    // Set the filter predicate function
    this.dataSource.filterPredicate = (data: Accounts, filter: string) => {
      if (!filter) return true; // Return true if no filter is applied

      const { status, country } = JSON.parse(filter);
      let matchStatus = true;
      let matchCountry = true;

      if (status) {
        matchStatus = data.status.trim().toLowerCase() === status;
      }

      if (country) {
        matchCountry = data.country.trim().toLowerCase() === country;
      }

      return matchStatus && matchCountry;
    };

    // Apply combined filter
    let combinedFilter: any = {};

    if (statusFilter) {
      combinedFilter.status = statusFilter;
    }

    if (countryFilter) {
      combinedFilter.country = countryFilter;
    }

    this.dataSource.filter = JSON.stringify(combinedFilter);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      console.log('The last filter value is ', this.dataSource.filter);
    }
  }


  getStatusBackgroundColor(status: string): any {
    // console.log('Backgroung color change is called');
    
    if (status === 'Invitation Sent') {
      return { 'background-color': '#FFCE7880', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' };
    } else if (status === 'Active') {
      return { 'background-color': '#78FFA098', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' };
    } else if (status === 'Disabled') {
      return { 'background-color': '#FF7B7B80', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' };
    }
    else {
      return {}; // Return default styles if status is neither Approved nor Pending
    }
  }
  getmcmStatusBackgroundColor(status: string): any {
    // console.log('Backgroung color change is called');
    
    if (status === 'Invited') {
      return { 'background-color': '#FFCE7880', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' };
    } else if (status === 'Approved') {
      return { 'background-color': '#78FFA098', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' };
    } else if (status === 'Inactive') {
      return { 'background-color': '#FF7B7B80', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' };
    }
    else {
      return {}; // Return default styles if status is neither Approved nor Pending
    }
  }
  onDialogClosed() {
    this.inviteSend = false; // Reset add_site property when dialog is closed
    //console.log('onDialogClosed', this.inviteSend);
  }

  onInviteSend() {
    this.inviteSend = true;
  }


  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    // console.log('Clicked element is: ', clickedElement);
    this.dataSource.data.forEach((element: Accounts) => {
        // Check if the clicked element is outside the action button or dropdown for the current element
        if (!this.isActionButtonOrDropdown(clickedElement, element)) {
            // Hide the dropdown by setting showOptions to false
            element.showOptions = false;
        }
    });
    // Perform change detection if necessary
    this.dataSource.data = [...this.dataSource.data];
}

isActionButtonOrDropdown(clickedElement: HTMLElement, element: Accounts): boolean {
  // Define an array of selectors to check against
  const selectors = ['.image-button', '.action-image'];

  // Traverse up the DOM tree from the clicked element
  let currentElement: HTMLElement | null = clickedElement;

  while (currentElement !== null) {
      // Check if the current element matches any of the selectors
      for (const selector of selectors) {
          if (currentElement.matches(selector)) {
              return true;
          }
      }
      // Move up to the parent element
      currentElement = currentElement.parentElement;
  }
  return false;
}

  performAction(element: Accounts) {
    //console.log("Button value is ", element);
    //alert('Action button is clicked');
    this.dataSource.data.forEach((item: any) => {
      if(item !== element) {
        item.showOptions = false;
      }
    })
    element.showOptions = !element.showOptions;
    console.log(element.showOptions);
  }

  fetchData() {
    this.userService.get_admin_account_list().subscribe(
      (response: any[]) => {
        const mappedUsers: Accounts[] = response.map(user => ({
          id: user.Account_Id,
          publisher_id: user['GAM_Publisher ID'],
          publisher_name: user['Account_Name'],
          network_id: user['GAM_Network ID'],
          status: user.Status,
          mcm_status: user.GAM_status,
          country: user.Country,
          phone: user.Phone,
          email: user.Email,
          margin: user.Margin,
          sites: user.Sites,
          apps: user.Apps, 
          gross: user['Gross/Net'],
          approved_on: user['Approved_On'],
          created_on: user['Created_On'],
          created_by: user['Created_By'],
          showOptions: false,
          
        }));
        this.dataSource.data = mappedUsers;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
        //console.log('users data', this.dataSource.data);
        // console.log('Response data', response);
      },
      (error) => {
        console.log('Error Fetching users:', error);
      }
    );
  }



  checkStatus(element: any) {
    console.log('CheckStatus: ', element.email,'id: ', element.id);
    const statusOfMcm = {
      email: element.email,
    }
    const rowId= element.id;
    //console.log('mcm value sent: ',statusOfMcm);
    
    this.userService.checkStatusOfMcm(statusOfMcm).subscribe(
      (response) => {
        console.log('Response from gam APi for status is: ', response);
        //console.log(response.status);
        const mcm = response.status;
        this.updateAdminAccountListMcmStatus(mcm, rowId);
      }, 
      (error)=> {
        console.log('Error fetching data: ', error); 
      }
    )
    
  }

  setPublisherName(element: any) {
    const dataString = JSON.stringify(element);
    this.setUserDetails(dataString);
    // this.router.navigate(['/accounts', { data: dataString }]);
    this.userService.setPublisherNameAndId(element.publisher_name, element.id);
  }

  setUserDetails(element:any) {
    this.userService.setUserDetails(element);
  }


  resendInvite(element: any) {
    const dataSent = {
      email: element.email, 
      margin: element.margin
    }
     console.log('resendInvite row ',element.id );
    this.userService.resendInvite(dataSent).subscribe(
      (response) => {
        console.log('ResendInvite: ', response);
        
        // alert('Resend Invite sent successfully!!!');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Resend Invite sent Successfully', life: 5000  });
        this.fetchData();
        
      }, 
      (error) => {
        console.log('Error is sending resend invite:', error);
        // alert('Error in resending invite!!!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in sending Resend Invite', life: 5000  });

        
      }
    )

  }
  revokeInvite(element: any) {
    console.log('revokeInvite row: ', element.id);
    const statusOfMcm = {
      email: element.email,
    }
    // const rowId= element.id;
    this.userService.revoke_invite(statusOfMcm).subscribe(
      (response) => {
        // alert('Revoke invite sent!!!');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Revoke Invite Sent!!', life: 5000  });
        this.fetchData();
        // const mcm = response.status;
        // this.updateAdminAccountListStatus(mcm, rowId);

      }, 
      (error) => {
        console.log('Error fetching data: ', error); 
        // alert('Error sending revoke invite:');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error sending Revoke Invite', life: 5000  });
      }
    )


    
  }
  disable(element: any) {
    const statusUpdate = {
      id: element.id, 
      status:'Disabled'
    }
    const disabled = {
      email: element.email, 
      status: 'Disabled'
    }
    console.log('disable row: ', element.id);
    this.userService.disableOption(disabled).subscribe(
      (response) => {
        console.log('Disabled successfully!!!', response);
        if(response.message=="Status updated successfully") {
          // alert('Disabled successfully!!!');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Disabled Successfully', life: 5000  });
          this.updateDisableStatus(statusUpdate.status, statusUpdate.id);
        }
        if(response.message== "No rows updated") {
          // alert("No records found with this email,  disable is unsuccessfully!!");
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No records found !!!', life: 5000  });

        } 
      }, 
      (error) => {
        console.log('Error disabling ', error);
        // alert('Error disabling option!!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Disabling!!', life: 5000  });

        
      }
    )
    
  }

  updateAdminAccountListMcmStatus(status: any, idNo: any) {

    const status_string=  status.toLowerCase().replace(/^\w/, (c:string) => c.toUpperCase());
    const Data = {
      MCM_status: status_string,
      id: idNo
    }
    this.userService.mcm_status_update(Data).subscribe(
      (response) => {
        console.log('Response from admin_account_list table', response);
        this.fetchData();
        // alert('MCM Status updated!!!');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'MCM Status updated!!', life: 5000  });
      },
      (error) => {
        console.log('Error in updating mcm_status in table', error);
        // alert('Error: ' + error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in Updating MCM Status!!!', life: 5000  });
        
      }
    )
  }

  updateDisableStatus(status: any, idNo: any) {
    const status_string=  status.toLowerCase().replace(/^\w/, (c:string) => c.toUpperCase());
    const Data = {
      Status: status_string,
      id: idNo
    }
    console.log('Data  is: ', Data);
    this.userService.updateStatusofDisable(Data).subscribe(
      (response) => {
        console.log('Response from admin_account_list table', response);
        this.fetchData();
        // alert('Disable Status updated!!!');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Disable Status Updated', life: 5000  });

      }, 
      (error) => {
        console.log('Error in updating disable status in table', error);
        // alert('Error: ' + error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in updating disable status !!!', life: 5000  });

      }
    )

  }

  

}

export interface Accounts {
  id: number;
  publisher_id: string;
  publisher_name: string;
  network_id: string;
  status: string;
  mcm_status: string;
  phone: string;
  email: string;
  country: string;
  margin: number;
  sites: string;
  apps: string;
  gross: number;
  approved_on: string;
  created_on: string;
  created_by: string;
  showOptions: boolean;
  // email: string;
  // phone: string;

}

/*
const ELEMENT_DATA: Accounts[] = [
  { id: 1, name: 'Element 1', status: 'Approval Required', mcm_status: 'Approved', country: 'India', margin: 0.25, sites: 'Site A', apps: 'App A' },
  { id: 2, name: 'Element 2', status: 'Active', mcm_status: 'Pending', country: 'India', margin: 0.5, sites: 'Site B', apps: 'App B' },
  { id: 3, name: 'Element 3', status: 'Active', mcm_status: 'Approved', country: 'UK', margin: 0.75, sites: 'Site C', apps: 'App C' },
  { id: 4, name: 'Element 4', status: 'Declined', mcm_status: 'Pending', country: 'USA', margin: 1.0, sites: 'Site D', apps: 'App D' },
  { id: 5, name: 'Element 5', status: 'Approval Required', mcm_status: 'Approved', country: 'India', margin: 1.25, sites: 'Site E', apps: 'App E' },
  { id: 3, name: 'Element 3', status: 'Active', mcm_status: 'Approved', country: 'UK', margin: 0.75, sites: 'Site C', apps: 'App C' },
  { id: 4, name: 'Element 4', status: 'Declined', mcm_status: 'Pending', country: 'USA', margin: 1.0, sites: 'Site D', apps: 'App D' },
  { id: 5, name: 'Element 5', status: 'Approval Required', mcm_status: 'Approved', country: 'India', margin: 1.25, sites: 'Site E', apps: 'App E' }
];
*/
