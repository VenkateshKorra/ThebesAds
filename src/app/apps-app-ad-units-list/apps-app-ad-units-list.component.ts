import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { adFormat, platforms } from '../sign-up-dropdown';



@Component({
  selector: 'app-apps-app-ad-units-list',
  templateUrl: './apps-app-ad-units-list.component.html',
  styleUrl: './apps-app-ad-units-list.component.css'
})
export class AppsAppAdUnitsListComponent implements AfterViewInit {
  selectedOs = '';
  selectedAdFormat='';
  ad_units= false;
  account_name='';
  adFormat_options: any;
  os_options: any;
  currentUrl = '';
  publisherIdSent: any;

  displayedColumns: string[] = ['id', 'ad_unit_id', 'ad_unit_name','publisher_id', 'app_id', 'os',  'ad_format', 'size', 'parentAdUnitId', 'action'];
  dataSource = new MatTableDataSource<App_ad_units>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UsersService){
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  ngOnInit(): void {
    this.adFormat_options = adFormat;
    this.os_options= platforms;
    this.activatedRoute.params.subscribe(params=> {
       this.account_name=params['name'];
    })
    this.fetchData();
   
    
}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      console.log("The filter is",this.dataSource.filter);
    }
  }

  applyFilterByOs(symbol: string) {
    // Update selectedSymbol
    this.selectedOs = symbol;

    // Apply filters
    console.log('Status is : ', this.selectedOs);
    this.applyAllFilters();
  }

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

      if (os) {
        matchOs = data.os.trim().toLowerCase() === os;
      }

      if (ad_format) {
        matchAdFormat = data.ad_format.trim().toLowerCase() === ad_format;
      }

      return matchOs && matchAdFormat;
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

  performAction(element: App_ad_units) {
    element.showOptions = !element.showOptions;

  }

  getStatusBackgroundColor(status: string): any {
    if (status === 'Approved' ) {
        return { 'background-color': '#78FFA098', 'padding': '2px 8px', 'border-radius': '4px', 'color': '#5F616E', 'width': 'fit-content' };
    } else if (status === 'Pending') {
        return { 'background-color': '#FFFF7898', 'padding': '2px 4px', 'border-radius': '4px', 'color': '#5F616E', 'width': 'fit-content'  };
    } else {
        return {}; // Return default styles if status is neither Approved nor Pending
    }
}
getMcmStatusBackgroundColor(mcm_status: string): any {
  if (mcm_status === 'Approved' ) {
    return { 'background-color': '#78FFA098', 'padding': '2px 8px', 'border-radius': '4px', 'color': '#5F616E', 'width': 'fit-content' };
} else if (mcm_status === 'Pending') {
    return { 'background-color': '#FFFF7898', 'padding': '2px 4px', 'border-radius': '4px', 'color': '#5F616E', 'width': 'fit-content'  };
} else {
    return {}; // Return default styles if status is neither Approved nor Pending
}
}

openAppAdUnits() {
  this.ad_units = true;
  console.log("Inside App Ad Unit");
  this.router.navigate(['/add-app-ad-units'], { queryParams: {account : this.account_name}});
}





fetchData() {
  if (this.userService.getType() == 'Admin' && this.currentUrl == '') {
    this.publisherIdSent = this.userService.getSetPublisherId();
  }
  else if (this.userService.getType() == 'Publisher') {
    this.publisherIdSent = this.userService.getPublisherId();
  }
  const Data = {
    type: this.userService.getType(),
    publisher_id: this.publisherIdSent,
    currentUrl: this.currentUrl
  }
  console.log('App ad Unit Data sent is: ', Data);
  
  this.userService.get_app_ad_units(Data).subscribe(
    (response: any[]) => {
      const mappedUsers: App_ad_units[] = response.map((user, index) => ({
        id: index +1 ,
        ad_unit_id: user.Ad_unit_ID,
        ad_unit_name: user.Ad_Unit_name,
        publisher_id: user['Publisher ID'],
        app_id: user['site_id/app_id'],
        os: user.os,
        size: user.size,
        ad_format: user.ad_format,
        parentAdUnitId: user.parentAdUnitId,
        showOptions: false
        
      }));
      this.dataSource.data = mappedUsers;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
        // this.dataSource.paginator.lastPage();
      }
      
      //console.log('users data', this.dataSource.data);
      console.log('Response data', response);
    },
    (error) => {
      console.log('Error Fetching users:', error);
      alert('Error Fetching site table!!');
    }
  );
}

onAppAdClosed() {
  this.ad_units = false; // Reset add_site property when dialog is closed
  console.log('onAdClosed', this.ad_units);
}

generateReport(element: any) {
  console.log('generate Report');
  alert('Generate report');
}

copyAdTag(element: any) {
  console.log('generate GPT TAG');
  alert('Generate Gpt Tag');
}

}


export interface App_ad_units {
  id: number;
  ad_unit_id: string;
  ad_unit_name: string;
  publisher_id: string;
  app_id: string;
  os: string;
  ad_format: string;
  size: string;
  parentAdUnitId: string;
  showOptions : boolean;

}

// const ELEMENT_DATA: App_ad_units[] = [
//   { id: 1, account: 'Account 1', app_name: 'App 1', ad_unit_name: 123, os: 'android', ad_format: 'Banner', size: '300x250' },
//   { id: 2, account: 'Account 2', app_name: 'App 2', ad_unit_name: 456, os: 'ios', ad_format: 'Interstitial', size: '1024x768' },
//   { id: 3, account: 'Account 3', app_name: 'App 3', ad_unit_name: 789, os: 'android', ad_format: 'Native', size: '320x480' },
//   // Add more elements as needed
// ];


