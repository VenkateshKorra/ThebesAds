import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-account-sites',
  templateUrl: './account-sites.component.html',
  styleUrl: './account-sites.component.css'
})
export class AccountSitesComponent implements AfterViewInit, OnInit{

  selectedName="";
  selectedSymbol = '';
  add_site= false;


  displayedColumns: string[] = ['id', 'site_name', 'site_id', 'publisher_id', 'url', 'categories', 'ad_units', 'status', 'mcm_status', 'parentAdUnitId', 'action'];
  dataSource = new MatTableDataSource<AddSite>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UsersService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      this.fetchData();
      this.route.params.subscribe(params => {
        const name = params['name'];
        this.selectedName = name;
        // Now you can use the `name` value in your component

      });
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

  applyFilterBySymbol(symbol: string) {
    this.dataSource.filterPredicate = (data: AddSite, filter: string) =>
      data.status.trim().toLowerCase() === filter.trim().toLowerCase();

    this.dataSource.filter =  symbol;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      console.log("The filter is",this.dataSource.filter);
    }
  }


  fetchData() {
    this.userService.get_add_site().subscribe(
      (response: any[]) => {
        const mappedUsers: AddSite[] = response.map((user, index) => ({
          id: index +1 ,
          site_name: user.site_name,
          site_id: user.site_id,
          publisher_id: user['Publisher ID'],
          url: user.url,
          categories: user.categories,
          ad_units: user.ad_units,
          status: user.status,
          mcm_status: user.mcm_status, 
          parentAdUnitId: user.parentAdUnitId,
          showOptions: false, 
          
          
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


  performAction(element: AddSite) {
    //console.log("Button value is ", element);
    //alert('Action button is clicked');
    element.showOptions = !element.showOptions;
  }

  getStatusBackgroundColor(status: string): any {
    if (status === 'Approved') {
        return { 'background-color': '#78FFA0', 'padding': '2px 8px', 'border-radius': '4px', 'color': '#5F616E', 'width': '100%' };
    } else if (status === 'Pending') {
        return { 'background-color': '#FFFF78', 'padding': '2px 8px', 'border-radius': '4px', 'color': '#5F616E', 'width': '100%'  };
    } else {
        return {}; // Return default styles if status is neither Approved nor Pending
    }
}

openAddSite() {
  this.add_site = true;
  console.log('OpenAddSite clicked');
}

onDialogClosed() {
  this.add_site = false; // Reset add_site property when dialog is closed
  console.log('onDialogClosed', this.add_site);
  this.fetchData();
}

stopAds(element: any) {
  console.log('StopAds clicked');
  // alert('StopAds');
  const siteId= {
    site_id: element.site_id
  }
  this.userService.deactivateSite(siteId).subscribe(
    (response) => {
      console.log('Site Deactivated successfully!!!', response);
      alert('Deactivated successfully');
    }, 
    (error) => {
      console.log('Error in deactivating site', error);
      alert('Error: '+ error.error.error);
    }
    )
  
}

generateReport(element: any) {
  console.log('generate Report');
  alert('Generate report');
}

downloadAds(element: any) {
  console.log('Download Ads');
  alert('Download ads');
}


}

export interface AddSite {
  id: number;
  site_name: string;
  site_id: string;
  publisher_id: string;
  url: string;
  categories: string;
  ad_units: number;
  status: string;
  mcm_status: string;
  parentAdUnitId: string;
  showOptions: boolean;

}

