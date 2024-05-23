import { AfterViewInit, Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-account-sites',
  templateUrl: './account-sites.component.html',
  styleUrl: './account-sites.component.css'
})
export class AccountSitesComponent implements AfterViewInit, OnInit {

  selectedName: any;
  selectedSymbol = '';
  add_site = false;
  currentUrl = '';
  accountIdSent: any;

  typeOfUser='';


  displayedColumns: string[] = [ 'site_name', 'site_id', 'account_name',  'url', 'categories', 'ad_units', 'status', 'mcm_status', 'action'];
  dataSource = new MatTableDataSource<AddSite>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UsersService, private router: Router, private messageService: MessageService) {
    
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    // console.log('Url is: ', this.currentUrl);
    this.typeOfUser = this.userService.getType();

    this.fetchData();
    // this.route.params.subscribe(params => {
    //   const name = params['name'];
    if (this.userService.getType() == 'Admin') {
      this.selectedName = this.userService.getSelectedPublisherName();
    }
    else {
      this.selectedName = this.userService.getName();
    }
    // console.log('Name is : ', this.selectedName);
    // console.log('Current_url is: ', this.currentUrl);
    


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
      // console.log("The filter is", this.dataSource.filter);
    }
  }

  applyFilterBySymbol(symbol: string) {
    this.dataSource.filterPredicate = (data: AddSite, filter: string) =>
      data.status.trim().toLowerCase() === filter.trim().toLowerCase();

    this.dataSource.filter = symbol;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      // console.log("The filter is", this.dataSource.filter);
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
      account_id: parseInt(this.accountIdSent),
      currentUrl: this.currentUrl
    }
    // console.log('Data in account sites, ', Data);
    this.userService.get_add_site(Data).subscribe(
      (response: any[]) => {
        const mappedUsers: AddSite[] = response.map((user, index) => ({
          id: user.Site_Id,
          site_name: user.Site_name,
          site_id: user.GAM_Site_Id,
          account_name: user.Account_Name,
          publisher_id: user['Account_Id'],
          url: user.URL,
          categories: user.Catagory,
          ad_units: user.Ad_Units_Count,
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
        console.log('Error Fetching site table:', error);
        // alert('Error Fetching site table!!');
       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Fetching site table!!', life: 5000  });

      }
    );
  }

  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    // console.log('Clicked element is: ', clickedElement);
    this.dataSource.data.forEach((element: AddSite) => {
        // Check if the clicked element is outside the action button or dropdown for the current element
        if (!this.isActionButtonOrDropdown(clickedElement, element)) {
            // Hide the dropdown by setting showOptions to false
            element.showOptions = false;
        }
    });
    // Perform change detection if necessary
    this.dataSource.data = [...this.dataSource.data];
}

isActionButtonOrDropdown(clickedElement: HTMLElement, element: AddSite): boolean { //to check the mouse clicked element
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


  performAction(element: AddSite) {
      //console.log("Button value is ", element);
      //alert('Action button is clicked');
      this.dataSource.data.forEach((item: any) => {
        if(item !== element) {
          item.showOptions = false;
        }
      })
      element.showOptions = !element.showOptions;
  }

  // getStatusBackgroundColor(status: string): any {
  //   if (status === 'Approved') {
  //     return { 'background-color': '#78FFA0', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' };
  //   } else if (status === 'Pending') {
  //     return { 'background-color': '#FFFF78', 'padding': '2px 20px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' };
  //   } else {
  //     return { 'background-color': '#bde0fe', 'padding': '2px 4px', 'border-radius': '10px', 'color': '#5F616E', 'width': '100%', 'font-size': '10px'  };  // Return default styles if status is neither Approved nor Pending
  //   }
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
    return { 'background-color': '#bde0fe', 'padding': '2px 8px', 'border-radius': '10px', 'color': '#5F616E', 'width': 'fit-content' , 'text-align': 'center' }; // Return default styles if status is neither Approved nor Pending
}
}

  openAddSite() {
    this.add_site = true;
    console.log('OpenAddSite clicked');
  }

  onDialogClosed() {
    this.add_site = false; // Reset add_site property when dialog is closed
    console.log('onDialogClosed', this.add_site);
    // this.fetchData();
    this.ngOnInit();
  }

  stopAds(element: any) {
    console.log('StopAds clicked');
    // alert('StopAds');
    const siteId = {
      site_id: element.site_id
    }
    this.userService.deactivateSite(siteId).subscribe(
      (response) => {
        console.log('Site Deactivated successfully!!!', response);
        // alert('Deactivated successfully');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deactivated successfully', life: 5000  });

      },
      (error) => {
        console.log('Error in deactivating site', error);
        // alert('Error: ' + error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });
        
      }
    )

  }

  generateReport(element: any) {
    localStorage.setItem('Id', element.id);
    localStorage.setItem('Filter', 'Site');
    this.router.navigate(['/report-download']);
  }

  downloadAds(element: any) {
    console.log('Download Ads');
    const Data = {
      account_id : element.publisher_id
    }
    this.userService.getNetworkId(Data).subscribe(
      (response) => {
        // alert('Success !!!');
        this.generateFile(response['GAM_Network ID']);
      }, 
      (error) => {
        // alert('Error !!'+error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });
        
      }
    )
    // alert('Download ads');
  }


}

export interface AddSite {
  id: number;
  site_name: string;
  site_id: string;
  account_name: string;
  publisher_id: string;
  url: string;
  categories: string;
  ad_units: number;
  status: string;
  mcm_status: string;
  parentAdUnitId: string;
  showOptions: boolean;

}

