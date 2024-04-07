import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
// import { adUnitSizes} from '../adUnitSizes.service';
import { selectOptions } from '../siteAdUnitSizes';
import { UsersService } from '../users.service';




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
  publisherIdSent: any;

  sizes = selectOptions;

  displayedColumns: string[] = ['id', 'ad_unit_id', 'ad_unit_name', 'publisher_id', 'site_id', 'gam_ad_unit_path', 'size', 'ad_format', 'parentAdUnitId', 'action'];
  dataSource = new MatTableDataSource<Site_Ad_Units>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UsersService) {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }



  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.account_name = params['name'];
    })
    this.fetchData();
    // console.log('sizes are: ', this.sizes);

  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  performAction(element: Site_Ad_Units) {
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
    console.log("Inside App Ad Unit");
    this.router.navigate(['/add-site-ad-units'], { queryParams: { account: this.account_name } });
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
    console.log('Site ad Unit data sent is: ', Data);

    this.userService.get_site_ad_units(Data).subscribe(
      (response: any[]) => {
        const mappedUsers: Site_Ad_Units[] = response.map((user, index) => ({
          id: index + 1,
          ad_unit_id: user.Ad_unit_ID,
          ad_unit_name: user.Ad_Unit_name,
          publisher_id: user['Publisher ID'],
          site_id: user['site_id/app_id'],
          gam_ad_unit_path: user.gam_ad_unit_path,
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

  onSiteAdClosed() {
    this.ad_units = false; // Reset add_site property when dialog is closed
    console.log('onAdClosed', this.ad_units);
  }

  generateReport(element: any) {
    console.log('generate Report');
    alert('Generate report');
  }

  generateGptTag(element: any) {
    console.log('generate GPT TAG');
    alert('Generate Gpt Tag');
  }



}

export interface Site_Ad_Units {
  id: number;
  ad_unit_id: string;
  ad_unit_name: string;
  publisher_id: string;
  site_id: string;
  gam_ad_unit_path: string;
  size: string;
  ad_format: string;
  parentAdUnitId: string;
  showOptions: boolean;

}
