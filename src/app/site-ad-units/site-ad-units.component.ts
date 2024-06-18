import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
// import { adUnitSizes} from '../adUnitSizes.service';
import { selectOptions } from '../siteAdUnitSizes';
import { UsersService } from '../users.service';
import { MatSort } from '@angular/material/sort';
import { MessageService } from 'primeng/api';




@Component({
  selector: 'app-site-ad-units',
  templateUrl: './site-ad-units.component.html',
  styleUrl: './site-ad-units.component.css'
})
export class SiteAdUnitsComponent implements AfterViewInit, OnInit {
  selectedSymbol = '';
  ad_units = false;
  account_name = '';
  currentUrl = '';
  accountIdSent: any;

  sizes = selectOptions;

  displayedColumns: string[] = [ 'ad_unit_id', 'ad_unit_name', 'account_name', 'site_name', 'gam_ad_unit_path', 'size', 'ad_format', 'action'];
  dataSource = new MatTableDataSource<Site_Ad_Units>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UsersService, private messageService: MessageService) {
    // this.router.events.subscribe(() => {
    //   this.currentUrl = this.router.url;
    // });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    console.log('Url is: ', this.currentUrl);
    this.activatedRoute.params.subscribe(params => {
      this.account_name = params['name'];
    })
    this.fetchData();
    // console.log('sizes are: ', this.sizes);

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

  applyFilterBySymbol(symbol: string) {
    this.dataSource.filterPredicate = (data: Site_Ad_Units, filter: string) =>
      data.size.trim().toLowerCase() === filter.trim().toLowerCase();

    this.dataSource.filter = symbol;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      console.log("The filter is", this.dataSource.filter);
    }
  }

  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    // console.log('Clicked element is: ', clickedElement);
    this.dataSource.data.forEach((element: Site_Ad_Units) => {
        // Check if the clicked element is outside the action button or dropdown for the current element
        if (!this.isActionButtonOrDropdown(clickedElement, element)) {
            // Hide the dropdown by setting showOptions to false
            element.showOptions = false;
        }
    });
    // Perform change detection if necessary
    this.dataSource.data = [...this.dataSource.data];
}

isActionButtonOrDropdown(clickedElement: HTMLElement, element: Site_Ad_Units): boolean {
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

  performAction(element: Site_Ad_Units) {
    this.dataSource.data.forEach((item: any) => {
      if(item !== element) {
        item.showOptions = false;
      }
    })
    element.showOptions = !element.showOptions;
  }

  getStatusBackgroundColor(status: string): any {
    if (status === 'Approved') {
      return { 'background-color': '#78FFA0', 'padding': '2px 8px', 'border-radius': '4px', 'color': '#5F616E', 'width': '100%' };
    } else if (status === 'Pending') {
      return { 'background-color': '#FFFF78', 'padding': '2px 4px', 'border-radius': '4px', 'color': '#5F616E', 'width': '100%' };
    } else {
      return {}; // Return default styles if status is neither Approved nor Pending
    }
  }

  openSiteAdUnits() {
    this.ad_units = true;
    console.log("Inside Site Ad Unit");
    this.router.navigate(['/add-site-ad-units'], { queryParams: { account: this.account_name } });
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
    console.log('Site ad Unit data sent is: ', Data);

    this.userService.get_site_ad_units(Data).subscribe(
      (response: any[]) => {
        const mappedUsers: Site_Ad_Units[] = response.map((user, index) => ({
          id: user.AdUnit_Id,
          ad_unit_id: user.GAM_Adunit_Id,
          ad_unit_name: user.Ad_Unit_name,
          account_name:  user.Account_Name,
          site_name: user.Site_name,
          publisher_id: user['Account_Id'],
          site_id: user['Site_Id/App_id'],
          gam_ad_unit_path: user.GAM_ad_unit_path,
          size: user.size,
          ad_format: user.Ad_format,
          parentAdUnitId: user.ParentAdUnitId,
          showOptions: false
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
        console.log('Error Fetching site ad units table:', error);
        this.userService.logoutUser(error.error.error);
        // alert('Error Fetching site AD Unit table!!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Fetching site AD Unit table!!', life: 5000  });
      }
    );
  }

  onSiteAdClosed() {
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
    this.userService.getSiteTagDetails(Data).subscribe(
      (response) => {
        // alert('Success !!!' + response);
        this.generateFile(response.data, response.sizes);
      }, 
      (error) => {
        // alert('Error !!'+error.error.error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in downloading', life: 5000  });
      }
    )
    // alert('Download ads');
  }

  generateFile(network: string, sizes: any) {
    const network_code = network;
    const content = `<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
    <script>
      window.googletag = window.googletag || {cmd: []};
      googletag.cmd.push(function() {
        googletag.defineSlot(${network}, ${sizes}, 'div-gpt-ad-1712749066170-0').addService(googletag.pubads());
        googletag.pubads().enableSingleRequest();
        googletag.enableServices();
      });
    </script>
    =========BODY=============
    <!-- ${network} -->
    <div id='div-gpt-ad-1712749066170-0' style='min-width: 320px; min-height: 250px;'>
      <script>
        googletag.cmd.push(function() { googletag.display('div-gpt-ad-1712749066170-0'); });
      </script>
    </div>`;
    const blob = new Blob([content], { type: 'text/plain' });

    const anchor = document.createElement('a');
    anchor.download = 'Tags.txt';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();

    window.URL.revokeObjectURL(anchor.href);
  }

}

export interface Site_Ad_Units {
  id: number;
  ad_unit_id: string;
  ad_unit_name: string;
  account_name: string;
  site_name: string;
  publisher_id: string;
  site_id: string;
  gam_ad_unit_path: string;
  size: string;
  ad_format: string;
  parentAdUnitId: string;
  showOptions: boolean;

}
