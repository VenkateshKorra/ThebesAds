import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { platforms } from '../sign-up-dropdown';
import { MatSort } from '@angular/material/sort';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-account-details-apps',
  templateUrl: './account-details-apps.component.html',
  styleUrl: './account-details-apps.component.css'
})
export class AccountDetailsAppsComponent implements AfterViewInit, OnInit {

  selectedName: any;
  selectedSymbol = '';
  add_app= false;
  os_options: any;
  currentUrl = '';
  accountIdSent: any;

  typeOfUser='';

  displayedColumns: string[] = [ 'app_name', 'app_id', 'account_name', 'os', 'ad_units', 'categories',  'status', 'mcm_status', 'action'];
  dataSource = new MatTableDataSource<AddApp>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UsersService,  private router: Router,  private elementRef: ElementRef, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.os_options=platforms;
    this.currentUrl = this.router.url;

    this.typeOfUser = this.userService.getType();
    // console.log('Url is: ', this.currentUrl);
    this.fetchData();
    // this.route.params.subscribe(params => {
    //   const name = params['name'];
    if(this.userService.getType()=='Admin') {
      this.selectedName = this.userService.getSelectedPublisherName();
    }
    else {
      this.selectedName = this.userService.getName();
    }
    // console.log('Name is : ', this.selectedName);
    //   // Now you can use the `name` value in your component

    // });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      // console.log("The filter is",this.dataSource.filter);
    }
  }

  applyFilterBySymbol(symbol: string) {
    this.dataSource.filterPredicate = (data: AddApp, filter: string) =>
      data.os.trim().toLowerCase() === filter.trim().toLowerCase();

    this.dataSource.filter =  symbol;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      // console.log("The filter is",this.dataSource.filter);
    }
  }

  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    // console.log('Clicked element is: ', clickedElement);
    this.dataSource.data.forEach((element: AddApp) => {
        // Check if the clicked element is outside the action button or dropdown for the current element
        if (!this.isActionButtonOrDropdown(clickedElement, element)) {
            // Hide the dropdown by setting showOptions to false
            element.showOptions = false;
        }
    });
    // Perform change detection if necessary
    this.dataSource.data = [...this.dataSource.data];
}

isActionButtonOrDropdown(clickedElement: HTMLElement, element: AddApp): boolean {
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

  performAction(element: AddApp) {
    //console.log("Button value is ", element);
    //alert('Action button is clicked');
    // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error logging in !!!', life: 5000  });
    this.dataSource.data.forEach((item: any) => {
      if(item !== element) {
        item.showOptions = false;
      }
    })
    element.showOptions = !element.showOptions;
    // console.log(element.showOptions);
  }

//   clearSearch() {
//     // Clear the input field
//     const searchInput = document.getElementById('search') as HTMLInputElement;
//     if (searchInput) {
//       searchInput.value = '';
//     }

//     // Clear the selected status in the dropdown
//     this.selectedSymbol = '';
//     if (this.status && this.status.nativeElement) {
//       this.status.nativeElement.value = '';
//     }

//     // Clear the selected country in the dropdown (if applicable)
//     // Uncomment this block if you have a country dropdown
//     this.selectedCountry = '';
//     if (this.country && this.country.nativeElement) {
//       this.country.nativeElement.value = '';
//     }

//     // Apply all filters with empty values
//     this.applyAllFilters();
// }

  getStatusBackgroundColor(status: string): any {
    if (status === 'Active' ) {
        return { 'background-color': '#78FFA098', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' };
    } else if (status === 'Pending') {
        return { 'background-color': '#FFFF7898', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content'  };
    }
    else if (status === 'Disabled') {
      return { 'background-color': '#FF7B7B80', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' };
    } else {
      return { 'background-color': '#FFFF7898', 'padding': '2px 4px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content', 'font-size': '10px'  };  // Return default styles if status is neither Approved nor Pending
    }
}
getMcmStatusBackgroundColor(mcm_status: string): any {
  if (mcm_status === 'Approved' ) {
    return { 'background-color': '#78FFA098', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' };
} else if (mcm_status === 'Pending') {
    return { 'background-color': '#FFFF7898', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content'  };
} else {
    return { 'background-color': '#bde0fe', 'padding': '2px 8px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content'  }; // Return default styles if status is neither Approved nor Pending
}
}

generateFile(network: string) {
  const network_code = network;
  const content = `google.com, pub-9074816809942926, RESELLER, f08c47fec0942fa0\nthebeglobal.com, ${network_code}, DIRECT`;
  const blob = new Blob([content], { type: 'text/plain' });

  const anchor = document.createElement('a');
  anchor.download = 'Ads.txt';
  anchor.href = window.URL.createObjectURL(blob);
  anchor.click();

  window.URL.revokeObjectURL(anchor.href);
}


fetchData() {
  if(this.userService.getType()=='Admin' && this.currentUrl=='/accounts') {
    this.accountIdSent= this.userService.getSelectedPublisherId();
  }
  else if(this.userService.getType()=='Admin' && this.currentUrl=='/account-sites') {
    this.accountIdSent = this.userService.getAccountId();
  }
  else if(this.userService.getType()=='Publisher') {
    this.accountIdSent= this.userService.getAccountId();
  }

  const Data = {
    type: this.userService.getType(),
    account_id: this.accountIdSent,
    currentUrl: this.currentUrl
  }
  this.userService.get_add_app(Data).subscribe(
    (response: any[]) => {
      const mappedUsers: AddApp[] = response.map((user, index) => ({
        id: user.App_Id ,
        app_name: user.App_name,
        app_id: user.GAM_App_Id,
        account_name: user.Account_Name,
        publisher_id: user['Account_Id'],
        url: user.URL,
        os: user.OS,
        ad_units: user.Ad_Units_Count,
        categories: user.Catagory,
        status: user.Status,
        mcm_status: user.GAM_Status, 
        parentAdUnitId: user.ParentAdUnitId,
        showOptions: false, 
        
      }));
      this.dataSource.data = mappedUsers;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
        // this.dataSource.paginator.lastPage();
      }
      
      //console.log('users data', this.dataSource.data);
      // console.log('Response data', response);
    },
    (error) => {
      console.log('Error Fetching users:', error);
      // alert('Error Fetching app table!!');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Fetching app table!!', life: 5000  });
    }
  );
}

openAddSite() {
  this.add_app = true;
}

onDialogClosed() {
  this.add_app = false; // Reset add_site property when dialog is closed
  // console.log('onDialogClosed', this.add_app);
  // this.fetchData();
  this.ngOnInit();
}

stopAds(app_id: string) {
  console.log('StopAds clicked');
  // alert('StopAds');
  const appId= {
    app_id: app_id
  }
  this.userService.deactivateApp(appId).subscribe(
    (response) => {
      console.log('App Deactivated successfully!!!', response);
      // alert('Deactivated successfully!!!');
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deactivated successfully!!!', life: 5000 });
      this.disableStatus(app_id);

    }, 
    (error) => {
      console.log('Error in deactivating app', error);
      // alert('Error: '+ error.error.error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });
    }
    )
}
disableStatus(app_id: any) {
  const Data = {
    app_id : app_id,
    status: 'Disabled'
  }
  this.userService.disableAppStatus(Data).subscribe(
    (response) => {
      console.log('Disabled successful', response);
      // alert('Status disabled Successfully!!!');
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Status disabled Successfully!!!', life: 5000 });
    }, 
    (error) => {
      console.log('Error disabling app', error);
      // alert('Error: '+ error.error.error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });
      
      
    }
  )
}

generateReport(element: any) {
  localStorage.setItem('Id', element.id);
  localStorage.setItem('Filter', 'App');
  this.router.navigate(['/report-download']);
}

downloadAds(element: any) {
  console.log('Download Ads');
  const Data = {
    account_id : element.publisher_id
  }
  this.userService.getNetworkId(Data).subscribe(
    (response) => {
      // alert('Success !!!' + response);
      this.generateFile(response['GAM_Network ID']);
    }, 
    (error) => {
      // alert('Error !!'+error.error.error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });
    }
  )
}


}

export interface AddApp {
  id: number;
  app_name: string;
  app_id: string;
  account_name: string;
  publisher_id: string;
  url: string;
  os: string;
  ad_units: number;
  categories: string;
  status: string;
  mcm_status: string;
  parentAdUnitId: string;
  showOptions: boolean;
  
  
}


