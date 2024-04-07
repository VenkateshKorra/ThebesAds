import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { platforms } from '../sign-up-dropdown';



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
  publisherIdSent: any;

  displayedColumns: string[] = ['id', 'app_name', 'app_id', 'publisher_id', 'os', 'ad_units', 'categories',  'status', 'mcm_status','parentAdUnitId', 'action'];
  dataSource = new MatTableDataSource<AddApp>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UsersService,  private router: Router) {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  ngOnInit(): void {
    this.os_options=platforms;
    this.fetchData();
    // this.route.params.subscribe(params => {
    //   const name = params['name'];
    if(this.userService.getType()=='Admin') {
      this.selectedName = this.userService.getSetPublisherName();
    }
    else {
      this.selectedName = this.userService.getName();
    }
    console.log('Name is : ', this.selectedName);
    //   // Now you can use the `name` value in your component

    // });
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
    this.dataSource.filterPredicate = (data: AddApp, filter: string) =>
      data.os.trim().toLowerCase() === filter.trim().toLowerCase();

    this.dataSource.filter =  symbol;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      console.log("The filter is",this.dataSource.filter);
    }
  }

  performAction(element: AddApp) {
    //console.log("Button value is ", element);
    //alert('Action button is clicked');
    element.showOptions = !element.showOptions;
  }

  getStatusBackgroundColor(status: string): any {
    if (status === 'Approved' ) {
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

fetchData() {
  if(this.userService.getType()=='Admin' && this.currentUrl=='') {
    this.publisherIdSent= this.userService.getSetPublisherId();
  }
  else if(this.userService.getType()=='Publisher') {
    this.publisherIdSent= this.userService.getPublisherId();
  }

  const Data = {
    type: this.userService.getType(),
    publisher_id: this.publisherIdSent,
    currentUrl: this.currentUrl
  }
  this.userService.get_add_app(Data).subscribe(
    (response: any[]) => {
      const mappedUsers: AddApp[] = response.map((user, index) => ({
        id: index +1 ,
        app_name: user.app_name,
        app_id: user.app_id,
        publisher_id: user['Publisher ID'],
        url: user.url,
        os: user.os,
        ad_units: user.ad_units,
        categories: user.categories,
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
      alert('Error Fetching app table!!');
    }
  );
}

openAddSite() {
  this.add_app = true;
}

onDialogClosed() {
  this.add_app = false; // Reset add_site property when dialog is closed
  console.log('onDialogClosed', this.add_app);
  // this.ngOnInit();
}

stopAds(element: any) {
  console.log('StopAds clicked');
  // alert('StopAds');
  const appId= {
    app_id: element.app_id
  }
  this.userService.deactivateApp(appId).subscribe(
    (response) => {
      console.log('App Deactivated successfully!!!', response);
      alert('Deactivated successfully');
      this.disableStatus(element.app_id);

    }, 
    (error) => {
      console.log('Error in deactivating app', error);
      alert('Error: '+ error.error.error);
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
      alert('Status disabled successfully');
    }, 
    (error) => {
      console.log('Error disabling app', error);
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

export interface AddApp {
  id: number;
  app_name: string;
  app_id: string;
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


