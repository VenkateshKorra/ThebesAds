import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { timeOptions, metricsOptions } from '../admin-dashboard-dropdown';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from 'primeng/api';
import { UsersService } from '../users.service';


interface TopPublisher {
  rank: any;
  publisher_id: any;
  publisher_name: any;
  ctr: any;
  cpm: any;
  error_percentage: any;
  fill_rate: any;
  measurable_impressions: any;
  viewable_impressions: any;
  ad_request: any;
  total_clicks: any;
  total_error: any;
  total_impressions: any;
  total_response_served: any;
  total_revenue: any;
  unfilled_impressions: any;
  viewability_percentage: any;
}


interface TopSite {
  rank: any;
  site_id: any;
  site_name: any;
  ctr: any;
  cpm: any;
  error_percentage: any;
  fill_rate: any;
  measurable_impressions: any;
  viewable_impressions: any;
  ad_request: any;
  total_clicks: any;
  total_error: any;
  total_impressions: any;
  total_response_served: any;
  total_revenue: any;
  unfilled_impressions: any;
  viewability_percentage: any;
}
interface TopApp {
  rank: any;
  app_id: any;
  app_name: any;
  ctr: any;
  cpm: any;
  error_percentage: any;
  fill_rate: any;
  measurable_impressions: any;
  viewable_impressions: any;
  ad_request: any;
  total_clicks: any;
  total_error: any;
  total_impressions: any;
  total_response_served: any;
  total_revenue: any;
  unfilled_impressions: any;
  viewability_percentage: any;
}
interface TopAdUnit {
  rank: any;
  adUnit_id: any;
  adUnit_name: any;
  ctr: any;
  cpm: any;
  error_percentage: any;
  fill_rate: any;
  measurable_impressions: any;
  viewable_impressions: any;
  ad_request: any;
  total_clicks: any;
  total_error: any;
  total_impressions: any;
  total_response_served: any;
  total_revenue: any;
  unfilled_impressions: any;
  viewability_percentage: any;
}


@Component({
  selector: 'app-top-performers',
  templateUrl: './top-performers.component.html',
  styleUrl: './top-performers.component.css'
})
export class TopPerformersComponent implements OnInit, AfterViewInit {

  top10PublishersDisplayedColumns: string[] = ['rank', 'publisher_name', 'total_revenue', 'cpm', 'total_impressions', 'total_clicks',  'ctr', 'ad_request', 'total_response_served',  'fill_rate', 'unfilled_impressions', 'measurable_impressions', 'viewable_impressions', 'viewability_percentage', 'error_percentage',    'total_error'];
  top10AdUnitsDisplayedColumns: string[] = [ 'rank','adUnit_name', 'total_revenue', 'cpm', 'total_impressions', 'total_clicks',  'ctr', 'ad_request', 'total_response_served',  'fill_rate', 'unfilled_impressions', 'measurable_impressions', 'viewable_impressions', 'viewability_percentage', 'error_percentage',    'total_error'];
  top10SitesDisplayedColumns: string[] = [ 'rank','site_name','total_revenue', 'cpm', 'total_impressions', 'total_clicks',  'ctr', 'ad_request', 'total_response_served',  'fill_rate', 'unfilled_impressions', 'measurable_impressions', 'viewable_impressions', 'viewability_percentage', 'error_percentage',    'total_error'];
  top10AppsDisplayedColumns: string[] = ['rank', 'app_name','total_revenue', 'cpm', 'total_impressions', 'total_clicks',  'ctr', 'ad_request', 'total_response_served',  'fill_rate', 'unfilled_impressions', 'measurable_impressions', 'viewable_impressions', 'viewability_percentage', 'error_percentage',    'total_error'];

  top10PublishersDataSource = new MatTableDataSource<TopPublisher>();
  top10AdUnitsDataSource = new MatTableDataSource<TopAdUnit>();
  top10SitesDataSource = new MatTableDataSource<TopSite>();
  top10AppsDataSource = new MatTableDataSource<TopApp>();

  @ViewChild('paginator1', { static: true }) paginator1!: MatPaginator;
  @ViewChild('paginator2', { static: true }) paginator2!: MatPaginator;
  @ViewChild('paginator3', { static: true }) paginator3!: MatPaginator;
  @ViewChild('paginator4', { static: true }) paginator4!: MatPaginator;

  @ViewChild('sort1') sort1!: MatSort;
  @ViewChild('sort2') sort2!: MatSort;
  @ViewChild('sort3') sort3!: MatSort;
  @ViewChild('sort4') sort4!: MatSort;

  top_10_publishers: any;
  top_10_sites: any;
  top_10_apps: any;
  top_10_adUnits: any;

  time_period_options: any;
  metrics_options: any;
  account_id: any;

  userName: any;
  filterSelected = '';
  time_period = 'last_7_days';



  date = new Date();
  typeOfUser = '';

  constructor(private messageService: MessageService, private userService: UsersService) {}

  ngOnInit(): void {
    this.time_period_options = timeOptions;
    this.typeOfUser = this.userService.getType();
    this.userName = typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null;
    this.account_id = typeof localStorage !== 'undefined' ? localStorage.getItem('PublisherID') : null;
    if (this.userName != null && this.userName != undefined && this.account_id != null && this.account_id != undefined) {
      if (this.userName != undefined && this.userName != null) {
        // console.log('Inside ngOninit name is : ', this.userName);
        // console.log(`Name is ${this.userName}, account Id is ${this.account_id}`);
        if(this.typeOfUser=='Publisher') {
          const Data = {
            name: this.userName,
            Pub_id: this.account_id, 
            id: this.account_id,
            time_period: this.time_period,
            type: this.typeOfUser,
            date: this.date,
            filter: this.filterSelected
          };
          this.get_daily_data(Data);
        }
        else {
          const Data = {
            name: this.userName,
            id: this.account_id,
            time_period: this.time_period,
            type: this.typeOfUser,
            date: this.date,
            filter: this.filterSelected
          };
          this.get_daily_data(Data);
        }
        
        
      }
    }
  }

  ngAfterViewInit(): void {
    this.top10PublishersDataSource.paginator = this.paginator1;
    this.top10SitesDataSource.paginator = this.paginator2;
    this.top10AppsDataSource.paginator = this.paginator3; // paginator for tables
    this.top10AdUnitsDataSource.paginator = this.paginator4;
    // sorting initializing
    this.top10PublishersDataSource.sort = this.sort1;
    this.top10AdUnitsDataSource.sort = this.sort4;
    this.top10SitesDataSource.sort = this.sort2;
    this.top10AppsDataSource.sort = this.sort3;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.top10PublishersDataSource.filter = filterValue.trim().toLowerCase();

    if (this.top10PublishersDataSource.paginator) {
      this.top10PublishersDataSource.paginator.firstPage();
      // console.log("The filter is",this.dataSource.filter);
    }
  }
  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.top10SitesDataSource.filter = filterValue.trim().toLowerCase();

    if (this.top10SitesDataSource.paginator) {
      this.top10SitesDataSource.paginator.firstPage();
      // console.log("The filter is",this.dataSource.filter);
    }
  }
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.top10AppsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.top10AppsDataSource.paginator) {
      this.top10AppsDataSource.paginator.firstPage();
      // console.log("The filter is",this.dataSource.filter);
    }
  }
  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.top10AdUnitsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.top10AdUnitsDataSource.paginator) {
      this.top10AdUnitsDataSource.paginator.firstPage();
      // console.log("The filter is",this.dataSource.filter);
    }
  }

  onTimePeriodChange() { // time_period change updation
    if(this.typeOfUser=='Publisher') {
      const Data = {
        name: this.userName,
        Pub_id: this.account_id, 
        id: this.account_id,
        time_period: this.time_period,
        type: this.typeOfUser,
        date: this.date,
        filter: this.filterSelected
      };
      this.get_daily_data(Data);
    }
    else {
      const Data = {
        name: this.userName,
        id: this.account_id,
        time_period: this.time_period,
        type: this.typeOfUser,
        date: this.date,
        filter: this.filterSelected
      };
      this.get_daily_data(Data);
    }
      // console.log('onTimePeriod is clicked');
  }

  get_daily_data(Data: any) {
    if(this.typeOfUser=='Admin') {
      this.userService.get_Admin(Data).subscribe(
        (response) => {
          // console.log('Data Received in daily_data is: ', response);
  
          this.top_10_publishers = response.Top10Publisher;
          this.top_10_sites = response.Top10Site;
          this.top_10_apps = response.Top10App;
          this.top_10_adUnits = response.Top10AdUnit;
  
          this.top_publishers(this.top_10_publishers);
          this.top_sites(this.top_10_sites);
          this.top_apps(this.top_10_apps);
          this.top_adUnits(this.top_10_adUnits);
  
        },
        (error) => {
          // console.log('Error in getting data: ', error);
          // alert('Error: '+ error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
          this.userService.logoutUser(error.error.error);
  
        }
      )
    }
    if(this.typeOfUser=='AdOpsManager' || this.userService.getType()=='Distributor') {
      console.log('Inside adsOpsmanager');
      
      this.userService.manager_distributor(Data).subscribe(
        (response) => {
          // console.log('Data Received in daily_data is: ', response);
          // Store each part of the JSON response in the corresponding variable
          this.top_10_sites = response.Top10Site;
          this.top_10_apps = response.Top10App;
          this.top_10_adUnits = response.Top10AdUnit;
  
          // console.log('Response Data is: ', this.responseData);
  
          this.top_sites(this.top_10_sites);
          this.top_apps(this.top_10_apps);
          this.top_adUnits(this.top_10_adUnits);
  
        },
        (error) => {
          // console.log('Error in getting data: ', error);
          // alert('Error: '+ error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
          this.userService.logoutUser(error.error.error);
  
        }
      )
    }

    else {
      this.userService.get_publisher(Data).subscribe(
        (response) => {
          // console.log('Data Received in daily_data is: ', response);
  
          // this.top_10_publishers = response.Top10Publisher;
          this.top_10_sites = response.Top10Site;
          this.top_10_apps = response.Top10App;
          this.top_10_adUnits = response.Top10AdUnit;
  
          // this.top_publishers(this.top_10_publishers);
          this.top_sites(this.top_10_sites);
          this.top_apps(this.top_10_apps);
          this.top_adUnits(this.top_10_adUnits);
  
        },
        (error) => {
          // console.log('Error in getting data: ', error);
          // alert('Error: '+ error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
          this.userService.logoutUser(error.error.error);
  
        }
      )
    }
    
  }

  top_publishers(publisherData: any) {
    // console.log(publisherData);
    const mappedData: TopPublisher[] = publisherData.map((item: any, index: any): TopPublisher => ({
      rank: index+1,
      publisher_id: item.Publisher_Id,
      publisher_name: item.Publisher_Name,
      ctr: item.CTR ,
      cpm: item.Avg_eCPM,
      error_percentage: item.Error_Percentage ,
      fill_rate: item.Fill_rate ,
      measurable_impressions: item.Total_Active_View_Measurable_Impressions,
      viewable_impressions: item.Total_Active_View_Viewable_Impressions,
      ad_request: item.Total_Ad_Requests,
      total_clicks: item.Total_Clicks ,
      total_error: item.Total_Errors ,
      total_impressions: item.Total_Impressions,
      total_response_served: item.Total_Responses_Served ,
      total_revenue: item.Total_Revenue ,
      unfilled_impressions: item.Unfilled_Impressions ,
      viewability_percentage: item.Viewability_Percentage 
    }));
    // console.log('Mapped Publisher Data is: ', mappedData);
    this.top10PublishersDataSource.data = mappedData;
        if (this.top10PublishersDataSource.paginator) {
          this.top10PublishersDataSource.paginator.firstPage();
          // this.dataSource.paginator.lastPage();
        }
  }

  top_sites(siteData: any) {
    // console.log(siteData);

    const mappedData: TopSite[] = siteData.map((item: any,  index: any): TopSite => ({
      rank: index+1,
      site_id: item.site_Id,
      site_name: item.site_Name,
      ctr: item.CTR,
      cpm: item.Avg_eCPM,
      error_percentage: item.Error_Percentage,
      fill_rate: item.Fill_rate,
      measurable_impressions: item.Total_Active_View_Measurable_Impressions,
      viewable_impressions: item.Total_Active_View_Viewable_Impressions,
      ad_request: item.Total_Ad_Requests,
      total_clicks: item.Total_Clicks,
      total_error: item.Total_Errors,
      total_impressions: item.Total_Impressions,
      total_response_served: item.Total_Responses_Served,
      total_revenue: item.Total_Revenue,
      unfilled_impressions: item.Unfilled_Impressions,
      viewability_percentage: item.Viewability_Percentage
    }));
    // console.log('Mapped Site Data is: ', mappedData);
    this.top10SitesDataSource.data = mappedData;
    if (this.top10SitesDataSource.paginator) {
      this.top10SitesDataSource.paginator.firstPage();
      // this.dataSource.paginator.lastPage();
    }

  }
  top_apps(appData: any) {
    // console.log(appData);

    const mappedData: TopApp[] = appData.map((item: any,  index: any): TopApp => ({
      rank: index+1,
      app_id: item.app_Id,
      app_name: item.app_Name,
      ctr: item.CTR,
      cpm: item.Avg_eCPM,
      error_percentage: item.Error_Percentage,
      fill_rate: item.Fill_rate,
      measurable_impressions: item.Total_Active_View_Measurable_Impressions,
      viewable_impressions: item.Total_Active_View_Viewable_Impressions,
      ad_request: item.Total_Ad_Requests,
      total_clicks: item.Total_Clicks,
      total_error: item.Total_Errors,
      total_impressions: item.Total_Impressions,
      total_response_served: item.Total_Responses_Served,
      total_revenue: item.Total_Revenue,
      unfilled_impressions: item.Unfilled_Impressions,
      viewability_percentage: item.Viewability_Percentage
    }));

    // console.log('Mapped App Data is: ', mappedData);

    this.top10AppsDataSource.data = mappedData;
    if (this.top10AppsDataSource.paginator) {
      this.top10AppsDataSource.paginator.firstPage();
      // this.dataSource.paginator.lastPage();
    }



  }
  top_adUnits(adUnitsData: any) {

    // console.log(adUnitsData);

    const mappedData: TopAdUnit[] = adUnitsData.map((item: any,  index: any): TopAdUnit => ({
      rank: index+1,
      adUnit_id: item.ad_unit_Id,
      adUnit_name: item.ad_unit,
      ctr: item.CTR,
      cpm: item.Avg_eCPM,
      error_percentage: item.Error_Percentage,
      fill_rate: item.Fill_rate,
      measurable_impressions: item.Total_Active_View_Measurable_Impressions,
      viewable_impressions: item.Total_Active_View_Viewable_Impressions,
      ad_request: item.Total_Ad_Requests,
      total_clicks: item.Total_Clicks,
      total_error: item.Total_Errors,
      total_impressions: item.Total_Impressions,
      total_response_served: item.Total_Responses_Served,
      total_revenue: item.Total_Revenue,
      unfilled_impressions: item.Unfilled_Impressions,
      viewability_percentage: item.Viewability_Percentage

    }));

    // console.log('Mapped Ad Unit Data is: ', mappedData);
    this.top10AdUnitsDataSource.data = mappedData;
    if (this.top10AdUnitsDataSource.paginator) {
      this.top10AdUnitsDataSource.paginator.firstPage();
      // this.dataSource.paginator.lastPage();
    }
  }

  downloadTopPublishers() {
    try {
      const csvData = this.convertToCSV(this.top_10_publishers);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'top-10-publishers.csv'; 
      link.click();
      window.URL.revokeObjectURL(url); // Revoke the object URL after download
    } catch (error) {
      console.error('Error downloading chart 3:', error);
      // alert('Error in downloading CSV File.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in downloading CSV File.' , life: 5000  });
      // Show an error message to the user if needed
    }
  }


  downloadTopSites() {
    try {
      const csvData = this.convertToCSV(this.top_10_sites);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'top-10-sites.csv';
      link.click();
      window.URL.revokeObjectURL(url); // Revoke the object URL after download
    } catch (error) {
      console.error('Error downloading chart 3:', error);
      // alert('Error in downloading CSV File.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error downloading chart!!!', life: 5000 });
      // Show an error message to the user if needed
    }
  }

  downloadTopApps() {
    try {
      const csvData = this.convertToCSV(this.top_10_apps);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'top-10-apps.csv';
      link.click();
      window.URL.revokeObjectURL(url); // Revoke the object URL after download
    } catch (error) {
      console.error('Error downloading chart 3:', error);
      // alert('Error in downloading CSV File.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error downloading chart!!!', life: 5000 });
      // Show an error message to the user if needed
    }
  }
  downloadTopAdUnits() {
    try {
      const csvData = this.convertToCSV(this.top_10_adUnits);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'top-10-adUnits.csv';
      link.click();
      window.URL.revokeObjectURL(url); // Revoke the object URL after download
    } catch (error) {
      console.error('Error downloading chart 3:', error);
      // alert('Error in downloading CSV File.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error downloading chart!!!', life: 5000 });
      // Show an error message to the user if needed
    }
  }

  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(','); // Get headers from first object
    let csvContent = header + '\n';
    data.forEach(entry => {
      const values = Object.values(entry).join(',');
      csvContent += `${values}\n`;
    });
    return csvContent;
  }
}