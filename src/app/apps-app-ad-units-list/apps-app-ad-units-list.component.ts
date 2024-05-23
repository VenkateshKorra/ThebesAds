import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { adFormat, platforms } from '../sign-up-dropdown';
import { MatSort } from '@angular/material/sort';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-apps-app-ad-units-list',
  templateUrl: './apps-app-ad-units-list.component.html',
  styleUrl: './apps-app-ad-units-list.component.css'
})
export class AppsAppAdUnitsListComponent implements AfterViewInit {
  selectedOs = '';
  selectedAdFormat = '';
  ad_units = false;
  account_name = '';
  adFormat_options: any;
  os_options: any;
  currentUrl = '';
  accountIdSent: any;

  displayedColumns: string[] = [ 'ad_unit_id', 'ad_unit_name', 'account_name', 'app_name', 'ad_format', 'size', 'action'];
  dataSource = new MatTableDataSource<App_ad_units>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UsersService, private messageService: MessageService) {
    // this.router.events.subscribe(() => {
    //   this.currentUrl = this.router.url;
    // });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.adFormat_options = adFormat;
    this.os_options = platforms;
    this.activatedRoute.params.subscribe(params => {
      this.account_name = params['name'];
    })
    this.fetchData();


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
      console.log("The filter is", this.dataSource.filter);
    }
  }

  // applyFilterByOs(symbol: string) {
  //   // Update selectedSymbol
  //   this.selectedOs = symbol;

  //   // Apply filters
  //   console.log('Status is : ', this.selectedOs);
  //   this.applyAllFilters();
  // }

  applyFilterByAdFormat(symbol: string) {
    // Update selectedCountry
    this.selectedAdFormat = symbol;

    // Apply filters
    console.log('Country is : ', this.selectedAdFormat);
    this.applyAllFilters();
  }

  applyAllFilters() {
    // Combine status and country filters
    const osFilter = this.selectedOs.trim().toLowerCase();
    const adFormatFilter = this.selectedAdFormat.trim().toLowerCase();

    // Set the filter predicate function
    this.dataSource.filterPredicate = (data: App_ad_units, filter: string) => {
      if (!filter) return true; // Return true if no filter is applied

      const { os, ad_format } = JSON.parse(filter);
      let matchOs = true;
      let matchAdFormat = true;

      // if (os) {
      //   matchOs = data.os.trim().toLowerCase() === os;
      // }

      if (ad_format) {
        matchAdFormat = data.ad_format.trim().toLowerCase() === ad_format;
      }

      // return matchOs && matchAdFormat;
      return  matchAdFormat;
    };

    // Apply combined filter
    let combinedFilter: any = {};

    if (osFilter) {
      combinedFilter.os = osFilter;
    }

    if (adFormatFilter) {
      combinedFilter.ad_format = adFormatFilter;
    }

    this.dataSource.filter = JSON.stringify(combinedFilter);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      console.log('The last filter value is ', this.dataSource.filter);
    }
  }

  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    // console.log('Clicked element is: ', clickedElement);
    this.dataSource.data.forEach((element: App_ad_units) => {
        // Check if the clicked element is outside the action button or dropdown for the current element
        if (!this.isActionButtonOrDropdown(clickedElement, element)) {
            // Hide the dropdown by setting showOptions to false
            element.showOptions = false;
        }
    });
    // Perform change detection if necessary
    this.dataSource.data = [...this.dataSource.data];
}

isActionButtonOrDropdown(clickedElement: HTMLElement, element: App_ad_units): boolean {
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

  performAction(element: App_ad_units) {
    this.dataSource.data.forEach((item: any) => {
      if(item !== element) {
        item.showOptions = false;
      }
    })
    element.showOptions = !element.showOptions;

  }

  getStatusBackgroundColor(status: string): any {
    if (status === 'Approved') {
      return { 'background-color': '#78FFA098', 'padding': '2px 8px', 'border-radius': '4px', 'color': '#5F616E', 'width': 'fit-content' };
    } else if (status === 'Pending') {
      return { 'background-color': '#FFFF7898', 'padding': '2px 4px', 'border-radius': '4px', 'color': '#5F616E', 'width': 'fit-content' };
    } else {
      return {}; // Return default styles if status is neither Approved nor Pending
    }
  }
  getMcmStatusBackgroundColor(mcm_status: string): any {
    if (mcm_status === 'Approved') {
      return { 'background-color': '#78FFA098', 'padding': '2px 8px', 'border-radius': '4px', 'color': '#5F616E', 'width': 'fit-content' };
    } else if (mcm_status === 'Pending') {
      return { 'background-color': '#FFFF7898', 'padding': '2px 4px', 'border-radius': '4px', 'color': '#5F616E', 'width': 'fit-content' };
    } else {
      return {}; // Return default styles if status is neither Approved nor Pending
    }
  }

  openAppAdUnits() {
    this.ad_units = true;
    console.log("Inside App Ad Unit");
    this.router.navigate(['/add-app-ad-units'], { queryParams: { account: this.account_name } });
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
    // console.log('App ad Unit Data sent is: ', Data);

    this.userService.get_app_ad_units(Data).subscribe(
      (response: any[]) => {
        const mappedUsers: App_ad_units[] = response.map((user, index) => ({
          id: user.AdUnit_Id,
          ad_unit_id: user.GAM_Adunit_Id,
          ad_unit_name: user.Ad_Unit_name,
          account_name: user.Account_Name,
          app_name: user.App_name,
          publisher_id: user['Account_Id'],
          app_id: user['Site_Id/App_id'],
          // os: user.os,
          size: user.size,
          ad_format: user.Ad_format,
          parentAdUnitId: user.ParentAdUnitId,
          showOptions: false

          // (`AdUnit_Id`, `GAM_Adunit_Id`, `Ad_Unit_name`, `Account_Id`, `Site_Id/App_id`, `GAM_ad_unit_path`, `size`, `Ad_format`, `ParentAdUnitId`, `SiteorApp`)

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
        // alert('Error Fetching site table!!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching ad Units !!!', life: 5000  });
      }
    );
  }

  onAppAdClosed() {
    this.ad_units = false; // Reset add_site property when dialog is closed
    console.log('onAdClosed', this.ad_units);
  }

  generateReport(element: any) {
    localStorage.setItem('Id', element.id);
    localStorage.setItem('Filter', 'AdUnit');
    this.router.navigate(['/report-download']);
  }

  downloadAds(element: any) {
    console.log('Download Ads');
    const Data = {
      adUnitId : element.id,
    }
    this.userService.getAppTagDetails(Data).subscribe(
      (response) => {
        // alert('Success !!!' + response);
        this.generateFile(response.data, response.sizes);
      }, 
      (error) => {
        // alert('Error !!'+error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Downloading !!!', life: 5000  });
      }
    )
    // alert('Download ads');
  }

  generateFile(network: string, sizes: any) {
    const network_code = network;
    let sizesArray = JSON.parse(sizes);
  
    // If sizes is a single size array, convert it to a 2D array for consistency
    if (!Array.isArray(sizesArray[0])) {
      sizesArray = [sizesArray];
    }
    let content = `${network}\n=========SIZE=============\n`;
  
    sizesArray.forEach((size: any) => {
      const formattedSize = `(${size[0]},${size[1]})`;
      content += formattedSize + "\n";
    });
  
    const blob = new Blob([content], { type: 'text/plain' });
  
    const anchor = document.createElement('a');
    anchor.download = 'Tags.txt';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
  
    window.URL.revokeObjectURL(anchor.href);
  }
  


}


export interface App_ad_units {
  id: number;
  ad_unit_id: string;
  ad_unit_name: string;
  account_name: string;
  app_name: string;
  publisher_id: string;
  app_id: string;
  // os: string;
  ad_format: string;
  size: string;
  parentAdUnitId: string;
  showOptions: boolean;

}

