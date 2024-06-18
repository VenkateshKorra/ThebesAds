import { AfterViewInit, HostListener, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import Chart from 'chart.js/auto';
import { timeOptions, metricsOptions } from '../admin-dashboard-dropdown';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MessageService } from 'primeng/api';
import { Message } from "primeng/api";

interface TopSite {
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
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {


  top10AdUnitsDisplayedColumns: string[] = ['adUnit_name', 'total_revenue', 'cpm', 'total_impressions', 'total_clicks', 'ctr', 'ad_request', 'total_response_served', 'fill_rate', 'unfilled_impressions', 'measurable_impressions', 'viewable_impressions', 'viewability_percentage', 'error_percentage', 'total_error'];
  top10SitesDisplayedColumns: string[] = ['site_name', 'total_revenue', 'cpm', 'total_impressions', 'total_clicks', 'ctr', 'ad_request', 'total_response_served', 'fill_rate', 'unfilled_impressions', 'measurable_impressions', 'viewable_impressions', 'viewability_percentage', 'error_percentage', 'total_error'];
  top10AppsDisplayedColumns: string[] = ['app_name', 'total_revenue', 'cpm', 'total_impressions', 'total_clicks', 'ctr', 'ad_request', 'total_response_served', 'fill_rate', 'unfilled_impressions', 'measurable_impressions', 'viewable_impressions', 'viewability_percentage', 'error_percentage', 'total_error'];

  top10AdUnitsDataSource = new MatTableDataSource<TopAdUnit>();
  top10SitesDataSource = new MatTableDataSource<TopSite>();
  top10AppsDataSource = new MatTableDataSource<TopApp>();

  @ViewChild('paginator2', { static: true }) paginator2!: MatPaginator;
  @ViewChild('paginator3', { static: true }) paginator3!: MatPaginator;
  @ViewChild('paginator4', { static: true }) paginator4!: MatPaginator;

  @ViewChild('sort1') sort1!: MatSort;
  @ViewChild('sort2') sort2!: MatSort;
  @ViewChild('sort3') sort3!: MatSort;

  last_update_data_time: any;
  requested_date_time: any;
  latest_data = false;
  messages!: Message[];
  Request_status = '';
  isLengthZero = false;

  isLoaded = false;

  adUnitSelect = '';
  siteSelect = '';
  appSelect = '';
  time_period = 'last_7_days';
  overall_metrics = 'Total_Revenue';
  device_metrics = 'Total_Revenue';
  country_metrics = 'Total_Revenue';
  userName: any;
  impressions: any;
  clicks: any;
  revenue: any;
  fill_rate: any;
  ctr: any;
  cpm: any;
  ad_response: any;
  ad_request: any;
  error_rate: any;
  total_viewable: any;
  viewable_impressions = 0;
  measurable_impressions = 0;


  time_period_options: any;
  metrics_options: any;
  account_id: any;

  nextButton = 0;
  previousButton = 0;

  @ViewChild('canvas1') canvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2') canvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas3') canvas3!: ElementRef<HTMLCanvasElement>;

  chartType1 = 'impressions';
  chartType2 = 'bar'
  chartType3 = 'barHorizontal'

  apiData1: any[] = [];// saves chart 1 datat
  apiData2: any[] = []; //saves chart2 data
  apiData3: any[] = []; // saves chart 3 data
  public chart: any;

  chart1: Chart | undefined; //chart1 reference
  chart2: Chart | undefined; //chart2 reference
  chart3: Chart | undefined; //chart3 reference

  date = new Date()

  constructor(private userService: UsersService, private renderer: Renderer2, private elementRef: ElementRef, private messageService: MessageService) { }

  adUnitDropdownVisible: boolean = false;
  siteDropdownVisible: boolean = false;
  appDropdownVisible: boolean = false;

  adUnitDropDown: string[] = [];
  siteDropDown: string[] = [];
  appDropDown: string[] = [];


  adUnitFilteredOptions: any;
  siteFilteredOptions: any;
  appFilteredOptions: any;


  selectedAdUnitValue: any;
  selectedSiteValue: any;
  selectedAppValue: any;

  valueOfAdUnit: any;
  valueOfSite: any;
  valueOfApp: any;
  filterSelected = '';


  responseData: any; // This will store the 'response' data
  overallMetricsData: any; // This will store the 'overallMetrics' data
  deviceMetricsData: any; // This will store the 'deviceMetrics' data
  countryMetricsData: any; // This will store the 'countryMetrics' data

  top_10_publishers: any;
  top_10_sites: any;
  top_10_apps: any;
  top_10_adUnits: any;

  private dataRefreshInterval: any;
  private callFunctionInterval: any;
  typeOfUser = '';



  ngOnInit(): void {   // initalize with the component
    const time = new Date();
    // this.last_update_data_time = this.last_update_data_time + ' '+ time.getHours()+":" + time.getMinutes()+":" + time.getSeconds() ;
    this.time_period_options = timeOptions;
    this.metrics_options = metricsOptions;
    this.userName = typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null;
    this.account_id = typeof localStorage !== 'undefined' ? localStorage.getItem('PublisherID') : null;
    this.typeOfUser = this.userService.getType();



    if (this.userName != null && this.userName != undefined && this.account_id != null && this.account_id != undefined) {

      if (this.userName != undefined && this.userName != null) {
        this.get_dropdowns();
        // console.log('Inside ngOninit name is : ', this.userName);
        // console.log(`Name is ${this.userName}, account Id is ${this.account_id}`);
        const Data = {
          name: this.userName,
          id: parseInt(this.account_id),
          Pub_id: parseInt(this.account_id),
          time_period: this.time_period,
          type: this.typeOfUser,
          date: this.date,
          filter: this.filterSelected
        };
        this.get_daily_data(Data);
        this.getLastestDataDetails();


      }
    }
  }

  ngAfterViewInit(): void {  // initialize after component is alive
    this.top10SitesDataSource.paginator = this.paginator2;
    this.top10AppsDataSource.paginator = this.paginator3; // paginator for tables
    this.top10AdUnitsDataSource.paginator = this.paginator4;
    // sorting initializing
    this.top10SitesDataSource.sort = this.sort1;
    this.top10AppsDataSource.sort = this.sort2;
    this.top10AdUnitsDataSource.sort = this.sort3;


    if (this.userName != undefined && this.userName != null) {
      if (this.adUnitSelect == '' && this.siteSelect == '') {
        // console.log('Inside AfterViewInit: ', this.userName);
        const Data = {
          name: this.userName,
          date: this.date,
          Pub_id: parseInt(this.account_id),
          account_id: this.account_id,
          time_period: this.time_period,
          type: this.typeOfUser
        }
      }
    }
    this.callFunctionInterval = setInterval(() => {
      if (this.latest_data == true) {
          console.log('Inside Latest Data');
          this.getLastestDataDetails();
      }
    }, 30000);
  }

  ngOnDestroy(): void {
    // Clear the interval when leaving the component/page
    // clearInterval(this.dataRefreshInterval);
    clearInterval(this.callFunctionInterval);
  }

  clearFilter() {
    this.adUnitDropdownVisible = false;
    this.siteDropdownVisible = false;
    this.appDropdownVisible = false;
    this.selectedAdUnitValue = '';
    this.selectedAppValue = '';
    this.selectedSiteValue = '';
    this.filterSelected = '';
    this.valueOfAdUnit = ''
    this.valueOfApp = '';
    this.valueOfSite = '';
    this.time_period = 'last_7_days';
    this.onTimePeriodChange();
  }


  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    // Check if the clicked element is not within the component
    const clickedElement = event.target as HTMLElement;
    // console.log('Clicked Element is: ' , clickedElement);

    const adUnitElement = this.elementRef.nativeElement.querySelector('.adUnit');
    const siteElement = this.elementRef.nativeElement.querySelector('.site');
    const appElement = this.elementRef.nativeElement.querySelector('.app');

    // Close the dropdowns if the clicked element is not within them
    if (
      (!adUnitElement || !adUnitElement.contains(clickedElement)) &&
      (!siteElement || !siteElement.contains(clickedElement)) &&
      (!appElement || !appElement.contains(clickedElement))
    ) {
      this.adUnitDropdownVisible = false;
      this.siteDropdownVisible = false;
      this.appDropdownVisible = false;
    }
  }

  toggleDropdown(text: any) {  //make adUnit dropdown visible  
    if (text == 'ad unit') {
      this.adUnitDropdownVisible = !this.adUnitDropdownVisible;
      this.adUnitFilteredOptions = this.adUnitDropDown;
      this.siteDropdownVisible = false;
      this.appDropdownVisible = false;
      // this.filterSelected = 'AdUnit';
    }
    else if (text == 'site') {
      this.siteDropdownVisible = !this.siteDropdownVisible;
      this.siteFilteredOptions = this.siteDropDown;
      this.adUnitDropdownVisible = false;
      this.appDropdownVisible = false;
      // this.filterSelected = 'Site';
    }
    else if (text == 'app') {
      this.appDropdownVisible = !this.appDropdownVisible;
      this.appFilteredOptions = this.appDropDown;
      this.adUnitDropdownVisible = false;
      this.siteDropdownVisible = false;
      // this.filterSelected = 'App';
    }
    else {
      this.filterSelected = '';
    }
  }

  adUnitFilter(searchTerm: Event) {  //filter site for value
    const search = (searchTerm.target as HTMLInputElement).value;
    if (!search) {
      this.adUnitFilteredOptions = this.adUnitDropDown;
    } else {
      this.adUnitFilteredOptions = this.adUnitDropDown.filter(option => option.toLowerCase().includes(search.toLowerCase()));
    }
  }
  siteFilter(searchTerm: Event) {  // filter adunit for value
    const search = (searchTerm.target as HTMLInputElement).value;
    if (!search) {
      this.siteFilteredOptions = this.siteDropDown;
    } else {
      this.siteFilteredOptions = this.siteDropDown.filter(option => option.toLowerCase().includes(search.toLowerCase()));
    }
  }
  appFilter(searchTerm: Event) {  //filter site for value
    const search = (searchTerm.target as HTMLInputElement).value;
    if (!search) {
      this.appFilteredOptions = this.appDropDown;
    } else {
      this.appFilteredOptions = this.appDropDown.filter(option => option.toLowerCase().includes(search.toLowerCase()));
    }
  }


  adUnitSelectOption(value: any) {  //  assign site with the selected value
    this.valueOfAdUnit = value;
    this.selectedAdUnitValue = value.name;
    this.adUnitSelect = value.adUnit_id;
    this.filterSelected = 'AdUnit';
    // console.log("Site Selected Option:", value);
    this.valueOfApp = '';
    this.valueOfSite = '';
    this.appSelect = '';
    this.siteSelect = '';
    this.selectedAppValue = '';
    this.selectedSiteValue = '';
    this.adUnitDropdownVisible = false;
    // console.log(`ad Unit is: ${this.adUnitSelect}, site is: ${this.siteSelect}, app is: ${this.appSelect}, time_period is: ${this.time_period} `);
    const Data = {
      name: this.userName,
      id: this.adUnitSelect,
      Pub_id: parseInt(this.account_id),
      time_period: this.time_period,
      type: this.typeOfUser,
      date: this.date,
      filter: this.filterSelected
    };
    this.get_daily_data(Data);

  }

  siteSelectOption(value: any) {  //  assign site with the selected value
    this.valueOfSite = value;
    this.selectedSiteValue = value.name;
    this.siteSelect = value.site_id;
    this.filterSelected = 'Site';
    // console.log("Site Selected Option:", value);
    this.valueOfAdUnit = '';
    this.valueOfApp = '';
    this.adUnitSelect = '';
    this.appSelect = '';
    this.selectedAdUnitValue = '';
    this.selectedAppValue = '';
    this.siteDropdownVisible = false;
    // console.log(` ad Unit is: ${this.adUnitSelect}, site is: ${this.siteSelect}, app is: ${this.appSelect}, time_period is: ${this.time_period} `);
    const Data = {
      name: this.userName,
      id: this.siteSelect,
      Pub_id: parseInt(this.account_id),
      time_period: this.time_period,
      type: this.typeOfUser,
      date: this.date,
      filter: this.filterSelected
    };
    this.get_daily_data(Data);
  }

  appSelectOption(value: any) {  //  assign site with the selected value
    this.valueOfApp = value;
    this.selectedAppValue = value.name;
    this.appSelect = value.app_id;
    this.filterSelected = 'App'
    // console.log("Site Selected Option:", value);
    this.valueOfAdUnit = '';
    this.valueOfSite = '';
    this.adUnitSelect = '';
    this.siteSelect = '';
    this.selectedAdUnitValue = '';
    this.selectedSiteValue = '';
    this.appDropdownVisible = false;
    // console.log(`ad Unit is: ${this.adUnitSelect}, site is: ${this.siteSelect}, app is: ${this.appSelect}, time_period is: ${this.time_period} `);
    const Data = {
      name: this.userName,
      id: this.appSelect,
      Pub_id: parseInt(this.account_id),
      time_period: this.time_period,
      type: this.typeOfUser,
      date: this.date,
      filter: this.filterSelected
    };
    this.get_daily_data(Data);
  }

  onTimePeriodChange() { // time_period change updation
    const Data = {
      name: this.userName,
      id: parseInt(this.account_id),
      Pub_id: parseInt(this.account_id),
      time_period: this.time_period,
      type: this.typeOfUser,
      date: this.date,
      filter: this.filterSelected
    };
    // this.ngAfterViewInit();
    if (this.valueOfAdUnit) {
      this.filterSelected = 'AdUnit';
      this.adUnitSelectOption(this.valueOfAdUnit);
    }
    else if (this.valueOfSite) {
      this.filterSelected = 'Site';
      this.siteSelectOption(this.valueOfSite);
    }
    else if (this.valueOfApp) {
      this.filterSelected = 'App';
      this.appSelectOption(this.valueOfApp);
    }
    else {
      this.get_daily_data(Data);
      // console.log('onTimePeriod is clicked');

    }
  }

  get_daily_data(Data: any) {
    // if(this.typeOfUser=='AdOpsManager' || this.userService.getType()=='Distributor') {
    //   console.log('Inside adsOpsmanager');
      
    //   this.userService.manager_distributor(Data).subscribe(
    //     (response) => {
    //       // console.log('Data Received in daily_data is: ', response);
    //       // Store each part of the JSON response in the corresponding variable
    //       this.responseData = response.response; // Storing 'response' data
    //       this.overallMetricsData = response.overallMetrics; // Storing 'overallMetrics' data
    //       this.deviceMetricsData = response.deviceMetrics; //  Storing 'deviceMetrics' data
    //       this.countryMetricsData = response.countryMetrics; // Storing 'countryMetrics' data
    //       // this.top_10_sites = response.Top10Site;
    //       // this.top_10_apps = response.Top10App;
    //       // this.top_10_adUnits = response.Top10AdUnit;
  
    //       // console.log('Response Data is: ', this.responseData);
    //       this.setMetrics(this.responseData);
    //       this.revenue_chart(this.overallMetricsData);
    //       this.device_chart(this.deviceMetricsData);
    //       this.country_chart(this.countryMetricsData);
  
    //       this.top_sites(this.top_10_sites);
    //       this.top_apps(this.top_10_apps);
    //       this.top_adUnits(this.top_10_adUnits);
  
    //     },
    //     (error) => {
    //       // console.log('Error in getting data: ', error);
    //       // alert('Error: '+ error.error.error);
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
    //       this.userService.logoutUser(error.error.error);
    //       this.setDefaultMetrics();
    //       this.responseData = ''; // Storing 'response' data
    //       this.overallMetricsData = ''; // Storing 'overallMetrics' data
    //       this.deviceMetricsData = ''; // Storing 'deviceMetrics' data
    //       this.countryMetricsData = '';
  
    //     }
    //   )
    // }
    // else {
    //   console.log('Inside publisher');
    this.userService.get_publisher(Data).subscribe(
      (response) => {
        // console.log('Data Received in daily_data is: ', response);
        // Store each part of the JSON response in the corresponding variable
        this.responseData = response.response; // Storing 'response' data
        this.overallMetricsData = response.overallMetrics; // Storing 'overallMetrics' data
        this.deviceMetricsData = response.deviceMetrics; //  Storing 'deviceMetrics' data
        this.countryMetricsData = response.countryMetrics; // Storing 'countryMetrics' data
        // this.top_10_sites = response.Top10Site;
        // this.top_10_apps = response.Top10App;
        // this.top_10_adUnits = response.Top10AdUnit;

        // console.log('Response Data is: ', this.responseData);
        this.setMetrics(this.responseData);
        this.revenue_chart(this.overallMetricsData);
        this.device_chart(this.deviceMetricsData);
        this.country_chart(this.countryMetricsData);

        // this.top_sites(this.top_10_sites);
        // this.top_apps(this.top_10_apps);
        // this.top_adUnits(this.top_10_adUnits);

      },
      (error) => {
        // console.log('Error in getting data: ', error);
        // alert('Error: '+ error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
        this.userService.logoutUser(error.error.error);
        this.setDefaultMetrics();
        this.responseData = ''; // Storing 'response' data
        this.overallMetricsData = ''; // Storing 'overallMetrics' data
        this.deviceMetricsData = ''; // Storing 'deviceMetrics' data
        this.countryMetricsData = '';

      }
    )

  }

  setMetrics(response: any) {
    // console.log('Data in setMetrics is:', response);

    // Check if the response is an array with at least one element
    if (Array.isArray(response) && response.length > 0) {
      // Extract the first element from the array
      const data = response[0];

      // Access properties from the data object
      this.impressions = Number(data.Total_Impressions) || 0;
      this.clicks = Number(data.Total_Clicks) || 0;
      this.revenue = Number(data.Total_Revenue) || 0;
      this.fill_rate = Number(data.Fill_rate) || 0;
      this.ctr = Number(data.CTR) || 0;
      this.cpm = Number(data.Avg_eCPM) || 0;
      this.total_viewable = Number(data['Viewability_%']) || 0;
      this.error_rate = Number(data['error_%']) || 0;
      this.ad_request = Number(data.Total_ad_requests) || 0;
      this.ad_response = Number(data.Total_Ad_Response) || 0;
      this.viewable_impressions = Number(data.Total_Active_viewable_impressions) || 0;
      this.measurable_impressions = Number(data.Total_Active_measurable_impressions) || 0;
    }

  }
  setDefaultMetrics() {
    this.impressions = 0;
    this.clicks = 0;
    this.revenue = 0;
    this.fill_rate = 0;
    this.ctr = 0;
    this.cpm = 0;
    this.total_viewable = 0;
    this.error_rate = 0;
    this.ad_request = 0;
    this.ad_response = 0;
    this.viewable_impressions = 0;
    this.measurable_impressions = 0;
  }

  // applyFilter1(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.top10SitesDataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.top10SitesDataSource.paginator) {
  //     this.top10SitesDataSource.paginator.firstPage();
  //     // console.log("The filter is",this.dataSource.filter);
  //   }
  // }
  // applyFilter2(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.top10AppsDataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.top10AppsDataSource.paginator) {
  //     this.top10AppsDataSource.paginator.firstPage();
  //     // console.log("The filter is",this.dataSource.filter);
  //   }
  // }
  // applyFilter3(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.top10AdUnitsDataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.top10AdUnitsDataSource.paginator) {
  //     this.top10AdUnitsDataSource.paginator.firstPage();
  //     // console.log("The filter is",this.dataSource.filter);
  //   }
  // }


  getLastestDataDetails() {
    let tempVar;
    const Data = {
      account_id: parseInt(this.account_id)
      // account_id: 1
    }
    this.userService.getPollingRequest(Data).subscribe(
      (response) => {

        if (response.length <= 0) {
          this.isLengthZero = true;
          this.latest_data = false;
          this.last_update_data_time = 'NA';

          console.log('response length is: ', response.length);
          this.Request_status = 'No Data Requested';
        }
        else {
          // console.log('Response of get Latest Data: ', response);
          tempVar = response.Request_Status;
          this.last_update_data_time = response.Completed_On == '0000-00-00 00:00:00' ? 'NA' : response.Completed_On;
          this.requested_date_time = response.Requested_On == '0000-00-00 00:00:00' ? 'NA' : response.Requested_On;
          // console.log('last update date',this.last_update_data_time);
          // console.log('latest reponse: ', response[0].Completed_On);
          if (tempVar == 'I') {
            this.latest_data = true;
            this.Request_status = 'In-Progress';
          }
          else if (tempVar == 'T') {
            this.latest_data = true;
            this.Request_status = 'In-Queue';
          }
          else if (tempVar == 'C') {
            this.latest_data = false;
            this.Request_status = 'Completed';
          }
          else {
            this.latest_data = false;
            this.Request_status = 'Error';
          }

          console.log('Latest Data is: ', this.latest_data);
          
        }
      },
      (error) => {
        console.log('Error in getting Latest Data Details', error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
      }
    )
  }

  requestLatestData() {
    this.latest_data = true;
    const userName = typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null;
    const Data = {
      publisher_id: parseInt(this.account_id),
      user_id: userName
    };

    // this.messages = [{ severity: 'info', detail: 'Your Request Is In Progress Will Take Around 5 Min' }];
    console.log('Request Data is: ', Data);
    this.userService.requestLatestData(Data).subscribe(
      (response) => {
        console.log('Response: ', response);
        this.getLastestDataDetails();
        
        // this.messages =[{ severity: 'success', summary: 'Success', detail: 'Latest Data Updated' }];
      },
      (error) => {
        console.log('Error got: ', error);
        this.getLastestDataDetails();
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error occured: '+error.error.error, life: 5000 });
      }
    )
    

  }

  // async requestLatestData() {
  //   this.latest_data = true;
  //   const userName = typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null;
  //   const Data = {
  //     publisher_id: parseInt(this.account_id), 
  //     user_id: userName
  //   };

  //   try {
  //     await this.userService.connect('ws://localhost:8080');
  //     this.userService.sendRequest(Data)
  //       .subscribe(
  //         response => console.log('Response:', response),
  //         error => console.error('Error:', error)
  //       );

  //     this.messages = [{ severity: 'info', detail: 'Your Request Is In Progress Will Take Around 5 Min' }];

  //     setTimeout(() => {
  //       this.messages =[{ severity: 'success', summary: 'Success', detail: 'Latest Data Updated' }];
  //     }, 20000);
  //   } catch (error) {
  //     console.error('WebSocket connection error:', error);
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Websocket connection error!!', life: 5000  });
  //   }
  // }

  get_dropdowns() {  // get dropdownn values from adUnits table
    const Data = {
      account: this.account_id
    }
    this.userService.get_adUnits_in_user_dashboard(Data).subscribe(
      (response) => {
        // console.log('Response from adUnit dropdowns are:  ', response);
        // this.siteDropDown = response.data.map((item: any) => item.Ad_Unit_name)
        // this.adUnitDropDown = response.data.map((item: any) => item.Ad_Unit_name)
        const mappedData = response.data.map((item: any) => {
          return {
            name: item.Ad_Unit_name,
            adUnit_id: item.AdUnit_Id
          }
        })
        this.adUnitDropDown = mappedData;
        // console.log("Ad Unit DropDown is : ", this.adUnitDropDown);

      },
      (error) => {
        // console.log("Error getting ad Units and sites");
        // alert('Error: ' + error.error.error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
      }
    )
    this.get_siteNames();
    this.get_AppNames();
  }

  overall_metrics_changed() {
    this.revenue_chart(this.overallMetricsData);
  }
  device_metrics_changed() {
    this.device_chart(this.deviceMetricsData);
  }
  country_metrics_changed() {
    this.country_chart(this.countryMetricsData);
  }

  revenue_chart(Data: any) {
    // console.log('Over Metrics selected is: ', this.overall_metrics);
    if (this.overall_metrics == 'Total_Revenue') {
      this.apiData1 = this.overallMetricsData.map((entry: any) => ({
        date: entry.date,
        metrics: entry.Total_Revenue
      }));
      this.impressionChart('Total_Revenue');
    }
    else if (this.overall_metrics == "Total_Impressions") {
      this.apiData1 = this.overallMetricsData.map((entry: any) => ({
        date: entry.date,
        metrics: entry.Total_Impressions
      }));
      this.impressionChart('Total_Impressions');
    }
    else if (this.overall_metrics == 'Total_Clicks') {
      this.apiData1 = this.overallMetricsData.map((entry: any) => ({
        date: entry.date,
        metrics: entry.Total_Clicks
      }));
      this.impressionChart('Total_Clicks');
    }
    else if (this.overall_metrics == "Fill_rate") {
      this.apiData1 = this.overallMetricsData.map((entry: any) => ({
        date: entry.date,
        metrics: entry.Fill_rate
      }));
      this.impressionChart('Fill_rate');
    }
    else if (this.overall_metrics == "CTR") {
      this.apiData1 = this.overallMetricsData.map((entry: any) => ({
        date: entry.date,
        metrics: entry.CTR
      }));
      this.impressionChart('CTR');
    }
    else if (this.overall_metrics == "CPM") {
      this.apiData1 = this.overallMetricsData.map((entry: any) => ({
        date: entry.date,
        metrics: entry.Avg_eCPM
      }));
      this.impressionChart('CPM');
    }
    else if (this.overall_metrics == "Error_Percentage") {
      this.apiData1 = this.overallMetricsData.map((entry: any) => ({
        date: entry.date,
        metrics: entry.Error_Percentage
      }));
      this.impressionChart('Error_Percentage');
    }

  }

  device_chart(Data: any) {

    if (this.device_metrics == 'Total_Revenue') {
      this.apiData2 = this.deviceMetricsData.map((entry: any) => ({
        device: entry.device,
        metrics: entry.Total_Revenue
      }));
      this.barChart('Total_Revenue');
    }
    else if (this.device_metrics == "Total_Impressions") {
      this.apiData2 = this.deviceMetricsData.map((entry: any) => ({
        device: entry.device,
        metrics: entry.Total_Impressions
      }));
      this.barChart('Total_Impressions');
    }
    else if (this.device_metrics == 'Total_Clicks') {
      this.apiData2 = this.deviceMetricsData.map((entry: any) => ({
        device: entry.device,
        metrics: entry.Total_Clicks
      }));
      this.barChart('Total_Clicks');
    }
    else if (this.device_metrics == "Fill_rate") {
      this.apiData2 = this.deviceMetricsData.map((entry: any) => ({
        device: entry.device,
        metrics: entry.Fill_rate
      }));
      this.barChart('Fill_rate');
    }
    else if (this.device_metrics == "CTR") {
      this.apiData2 = this.deviceMetricsData.map((entry: any) => ({
        device: entry.device,
        metrics: entry.CTR
      }));
      this.barChart('CTR');
    }
    else if (this.device_metrics == "CPM") {
      this.apiData2 = this.deviceMetricsData.map((entry: any) => ({
        device: entry.device,
        metrics: entry.Avg_eCPM
      }));
      this.barChart('CPM');
    }
    else if (this.device_metrics == "Error_Percentage") {
      this.apiData2 = this.deviceMetricsData.map((entry: any) => ({
        device: entry.device,
        metrics: entry.Error_Percentage
      }));
      this.barChart('Error_Percentage');
    }
    // console.log('Device data is : ', this.apiData2);
  }

  country_chart(Data: any) {

    if (this.country_metrics == 'Total_Revenue') {
      this.apiData3 = this.countryMetricsData.map((entry: any) => ({
        country: entry.country,
        metrics: entry.Total_Revenue
      }));
      this.barHorizontalChart('Total_Revenue');
      //  console.log('Data of api3 is: ', this.apiData3);

    }
    else if (this.country_metrics == "Total_Impressions") {
      this.apiData3 = this.countryMetricsData.map((entry: any) => ({
        country: entry.country,
        metrics: entry.Total_Impressions
      }));
      this.barHorizontalChart('Total_Impressions');
    }
    else if (this.country_metrics == 'Total_Clicks') {
      this.apiData3 = this.countryMetricsData.map((entry: any) => ({
        country: entry.country,
        metrics: entry.Total_Clicks
      }));
      this.barHorizontalChart('Total_Clicks');
    }
    else if (this.country_metrics == "Fill_rate") {
      this.apiData3 = this.countryMetricsData.map((entry: any) => ({
        country: entry.country,
        metrics: entry.Fill_rate
      }));
      this.barHorizontalChart('Fill_rate');
    }
    else if (this.country_metrics == "CTR") {
      this.apiData3 = this.countryMetricsData.map((entry: any) => ({
        country: entry.country,
        metrics: entry.CTR
      }));
      this.barHorizontalChart('CTR');
    }
    else if (this.country_metrics == "CPM") {
      this.apiData3 = this.countryMetricsData.map((entry: any) => ({
        country: entry.country,
        metrics: entry.Avg_eCPM
      }));
      this.barHorizontalChart('CPM');
    }
    else if (this.country_metrics == "Error_Percentage") {
      this.apiData3 = this.countryMetricsData.map((entry: any) => ({
        country: entry.country,
        metrics: entry.Error_Percentage
      }));
      this.barHorizontalChart('Error_Percentage');
    }
    // console.log('Country data is : ', this.apiData3);

  }

  // Charts From here
  impressionChart(name: string) {  // draws section two chart
    if (this.chart1) {
      this.chart1.destroy(); // Destroy existing chart if it exists
    }
    const ctx = this.canvas1.nativeElement.getContext('2d');
    const labels = this.apiData1.map(entry => entry.date);
    const data = this.apiData1.map(entry => entry.metrics);
    // console.log('Label is: ', labels);
    // console.log('Data is: ', data);


    this.chart1 = new Chart(ctx!, {
      type: 'line', // this denotes the type of chart
      data: {
        // values on X-Axis
        labels: labels,
        datasets: [{
          label: name,
          data: data,
          backgroundColor: '#235fa9a2',
          fill: true,
          tension: 0.3,
          borderColor: '#707070',
          borderWidth: 1
        }],
      },
      options: {
        aspectRatio: 2,
        plugins: {
          legend: {
            display: true, // Show the legend
            position: 'bottom', // Position the legend at the bottom
          }
        },
        scales: {
          y: {
            ticks: {
              precision: 2,
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              callback: function (val, index) {
                // ... formatting logic ...
                let formattedValue = val;
                switch (name) {
                  case 'Total_Revenue':
                  case 'CPM':
                    formattedValue = '$' + val;
                    break;
                  case 'Fill_rate':
                  case 'CTR':
                  case 'Error_Percentage':
                    formattedValue = val + '%';
                    break;
                  default:
                    formattedValue = val;
                    break;
                }
                return formattedValue;
              },
            }
          }
        }
      }
    });

  }

  barChart(name: any) {  // draws section three chart
    if (this.chart2) {
      this.chart2.destroy(); // Destroy existing chart if it exists
    }
    const ctx = this.canvas2.nativeElement.getContext('2d');
    const labels = this.apiData2.map(entry => entry.device);
    const data = this.apiData2.map(entry => entry.metrics);
    // console.log('Label is: ', labels);
    // console.log('Data is: ', data);

    this.chart2 = new Chart(ctx!, {
      type: 'bar', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: labels,
        datasets: [
          {
            label: name,
            data: data,
            backgroundColor: '#0856A2',
            borderColor: '#707070',
            borderWidth: 1,
            barThickness: 5,
          },
        ]
      },
      options: {
        aspectRatio: 1.68,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: true, // Show the legend
            position: 'bottom', // Position the legend at the bottom
          }
        },
        scales: {
          x: {
            ticks: {
              precision: 2,
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              callback: function (val, index) {
                // ... formatting logic ...
                let formattedValue = val;
                switch (name) {
                  case 'Total_Revenue':
                  case 'CPM':
                    formattedValue = '$' + val;
                    break;
                  case 'Fill_rate':
                  case 'CTR':
                  case 'Error_Percentage':
                    formattedValue = val + '%';
                    break;
                  default:
                    formattedValue = val;
                    break;
                }
                return formattedValue;
              },
            }
          }
        }
      }
    });
  }

  barHorizontalChart(name: any) {  // draws section four chart
    if (this.chart3) {
      this.chart3.destroy(); // Destroy existing chart if it exists
    }
    if (this.nextButton == 0) {
      this.previousButton = this.nextButton;
      this.nextButton = 10;
    }
    else if (this.nextButton >= 10) {
      this.previousButton = this.nextButton - 10;
    }

    // console.log('previous is: ', this.previousButton);
    // console.log('next is: ', this.nextButton);

    const maxNextButton = this.apiData3.length; // Maximum value for nextButton

    // Ensure nextButton does not exceed the number of data points

    const ctx = this.canvas3.nativeElement.getContext('2d');
    const labels = this.apiData3.slice(this.previousButton, this.nextButton).map(entry => entry.country);
    const data = this.apiData3.slice(this.previousButton, this.nextButton).map(entry => entry.metrics);
    if (this.nextButton > maxNextButton) {
      this.nextButton = this.previousButton;
    }
    // const labels = this.apiData3.map(entry => entry.country);
    // const data = this.apiData3.map(entry => entry.metrics);
    this.chart3 = new Chart(ctx!, {
      type: 'bar', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: labels,
        datasets: [
          {
            label: name,
            data: data,
            backgroundColor: '#0B4E9A',
            borderColor: '#707070',
            borderWidth: 1,
            barThickness: 5,
          },
        ]
      },
      options: {
        aspectRatio: 1.86,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: true, // Show the legend
            position: 'bottom', // Position the legend at the bottom
          }
        },
        scales: {
          x: {
            ticks: {
              precision: 2,
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              callback: function (val, index) {
                // ... formatting logic ...
                let formattedValue = val;
                switch (name) {
                  case 'Total_Revenue':
                  case 'CPM':
                    formattedValue = '$' + val;
                    break;
                  case 'Fill_rate':
                  case 'CTR':
                  case 'Error_Percentage':
                    formattedValue = val + '%';
                    break;
                  default:
                    formattedValue = val;
                    break;
                }
                return formattedValue;
              },
            }
          }
        }
      }
    });
  }

  nextData() {
    this.nextButton = this.nextButton + 10;
    this.country_chart(this.countryMetricsData);
  }

  prevData() {
    // console.log('Next is in prev: ', this.nextButton);

    if (this.nextButton != 0) {
      this.nextButton = this.nextButton - 10;
      this.country_chart(this.countryMetricsData);
    }
  }

  // ----------------//
  get_siteNames() {
    const Data = {
      // account: this.account_id,
      type: 'Publisher',
      account_id: this.account_id,
    }
    // console.log('SIte Name data sent is: ', Data);

    this.userService.getSiteDropdown(Data).subscribe(
      (response) => {
        // console.log('Response from site Name are:  ', response);
        const mappedData = response.map((item: any) => {
          return {
            name: item.Site_name,
            site_id: item.Site_Id
          }
        });
        this.siteDropDown = mappedData;
        // console.log('SiteDrop Down values are: ', this.siteDropDown);

      },
      (error) => {
        // console.log("Error getting  sites names", error);
        // alert('Error: ' + error.error.error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
      }
    )
  }

  get_AppNames() {
    const Data = {
      // account: this.account_id,
      type: 'Publisher',
      account_id: this.account_id
    }
    this.userService.getAppDropdown(Data).subscribe(
      (response) => {
        // console.log('Response from App Name are:  ', response);

        const mappedData = response.map((item: any) => {
          return {
            name: item.App_name,
            app_id: item.App_Id
          }
        });
        this.appDropDown = mappedData;
        // console.log('AppDrop Down values are: ', this.appDropDown);
      },
      (error) => {
        // console.log("Error getting App names", error);
        // alert('Error: ' + error.error.error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
      }
    )
  }


  downloadChart1() {
    try {
      const csvData = this.convertToCSV(this.overallMetricsData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      if (this.filterSelected === "") {
        link.download = 'overall-metrics.csv';
      } else {
        link.download = this.filterSelected + '-overall-metrics.csv';
      }
      link.click();
      window.URL.revokeObjectURL(url); // Revoke the object URL after download
    } catch (error) {
      console.error('Error downloading chart 1:', error);
      // alert('Error in downloading CSV File.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error downloading chart!!!', life: 5000 });
      // Show an error message to the user if needed
    }
  }

  downloadChart2() {
    try {
      const csvData = this.convertToCSV(this.deviceMetricsData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      if (this.filterSelected === "") {
        link.download = 'device-metrics.csv';
      } else {
        link.download = this.filterSelected + '-device-metrics.csv';
      }
      link.click();
      window.URL.revokeObjectURL(url); // Revoke the object URL after download
    } catch (error) {
      console.error('Error downloading chart 2:', error);
      // alert('Error in downloading CSV File.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error downloading chart!!!', life: 5000 });
      // Show an error message to the user if needed
    }
  }

  downloadChart3() {
    try {
      const csvData = this.convertToCSV(this.countryMetricsData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      if (this.filterSelected === "") {
        link.download = 'country-metrics.csv';
      } else {
        link.download = this.filterSelected + '-country-metrics.csv';
      }
      link.click();
      window.URL.revokeObjectURL(url); // Revoke the object URL after download
    } catch (error) {
      console.error('Error downloading chart 3:', error);
      // alert('Error in downloading CSV File.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error downloading chart!!!', life: 5000 });
      // Show an error message to the user if needed
    }
  }

  // downloadTopSites() {
  //   try {
  //     const csvData = this.convertToCSV(this.top_10_sites);
  //     const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = 'top-10-sites.csv';
  //     link.click();
  //     window.URL.revokeObjectURL(url); // Revoke the object URL after download
  //   } catch (error) {
  //     console.error('Error downloading chart 3:', error);
  //     // alert('Error in downloading CSV File.');
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error downloading chart!!!', life: 5000 });
  //     // Show an error message to the user if needed
  //   }
  // }

  // downloadTopApps() {
  //   try {
  //     const csvData = this.convertToCSV(this.top_10_apps);
  //     const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = 'top-10-apps.csv';
  //     link.click();
  //     window.URL.revokeObjectURL(url); // Revoke the object URL after download
  //   } catch (error) {
  //     console.error('Error downloading chart 3:', error);
  //     // alert('Error in downloading CSV File.');
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error downloading chart!!!', life: 5000 });
  //     // Show an error message to the user if needed
  //   }
  // }
  // downloadTopAdUnits() {
  //   try {
  //     const csvData = this.convertToCSV(this.top_10_adUnits);
  //     const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = 'top-10-adUnits.csv';
  //     link.click();
  //     window.URL.revokeObjectURL(url); // Revoke the object URL after download
  //   } catch (error) {
  //     console.error('Error downloading chart 3:', error);
  //     // alert('Error in downloading CSV File.');
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error downloading chart!!!', life: 5000 });
  //     // Show an error message to the user if needed
  //   }
  // }

  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(','); // Get headers from first object
    let csvContent = header + '\n';
    data.forEach(entry => {
      const values = Object.values(entry).join(',');
      csvContent += `${values}\n`;
    });
    return csvContent;
  }



  // top_sites(siteData: any) {
  //   // console.log(siteData);

  //   const mappedData: TopSite[] = siteData.map((item: any): TopSite => ({
  //     site_id: item.site_Id,
  //     site_name: item.site_Name,
  //     ctr: item.CTR,
  //     cpm: item.Avg_eCPM,
  //     error_percentage: item.Error_Percentage,
  //     fill_rate: item.Fill_rate,
  //     measurable_impressions: item.Total_Active_View_Measurable_Impressions,
  //     viewable_impressions: item.Total_Active_View_Viewable_Impressions,
  //     ad_request: item.Total_Ad_Requests,
  //     total_clicks: item.Total_Clicks,
  //     total_error: item.Total_Errors,
  //     total_impressions: item.Total_Impressions,
  //     total_response_served: item.Total_Responses_Served,
  //     total_revenue: item.Total_Revenue,
  //     unfilled_impressions: item.Unfilled_Impressions,
  //     viewability_percentage: item.Viewability_Percentage
  //   }));
  //   // console.log('Mapped Site Data is: ', mappedData);
  //   this.top10SitesDataSource.data = mappedData;
  //   if (this.top10SitesDataSource.paginator) {
  //     this.top10SitesDataSource.paginator.firstPage();
  //     // this.dataSource.paginator.lastPage();
  //   }

  // }
  // top_apps(appData: any) {
  //   // console.log(appData);

  //   const mappedData: TopApp[] = appData.map((item: any): TopApp => ({
  //     app_id: item.app_Id,
  //     app_name: item.app_Name,
  //     ctr: item.CTR,
  //     cpm: item.Avg_eCPM,
  //     error_percentage: item.Error_Percentage,
  //     fill_rate: item.Fill_rate,
  //     measurable_impressions: item.Total_Active_View_Measurable_Impressions,
  //     viewable_impressions: item.Total_Active_View_Viewable_Impressions,
  //     ad_request: item.Total_Ad_Requests,
  //     total_clicks: item.Total_Clicks,
  //     total_error: item.Total_Errors,
  //     total_impressions: item.Total_Impressions,
  //     total_response_served: item.Total_Responses_Served,
  //     total_revenue: item.Total_Revenue,
  //     unfilled_impressions: item.Unfilled_Impressions,
  //     viewability_percentage: item.Viewability_Percentage
  //   }));

  //   // console.log('Mapped App Data is: ', mappedData);

  //   this.top10AppsDataSource.data = mappedData;
  //   if (this.top10AppsDataSource.paginator) {
  //     this.top10AppsDataSource.paginator.firstPage();
  //     // this.dataSource.paginator.lastPage();
  //   }



  // }
  // top_adUnits(adUnitsData: any) {

  //   // console.log(adUnitsData);

  //   const mappedData: TopAdUnit[] = adUnitsData.map((item: any): TopAdUnit => ({
  //     adUnit_id: item.ad_unit_Id,
  //     adUnit_name: item.ad_unit,
  //     ctr: item.CTR,
  //     cpm: item.Avg_eCPM,
  //     error_percentage: item.Error_Percentage,
  //     fill_rate: item.Fill_rate,
  //     measurable_impressions: item.Total_Active_View_Measurable_Impressions,
  //     viewable_impressions: item.Total_Active_View_Viewable_Impressions,
  //     ad_request: item.Total_Ad_Requests,
  //     total_clicks: item.Total_Clicks,
  //     total_error: item.Total_Errors,
  //     total_impressions: item.Total_Impressions,
  //     total_response_served: item.Total_Responses_Served,
  //     total_revenue: item.Total_Revenue,
  //     unfilled_impressions: item.Unfilled_Impressions,
  //     viewability_percentage: item.Viewability_Percentage

  //   }));

  //   // console.log('Mapped Ad Unit Data is: ', mappedData);
  //   this.top10AdUnitsDataSource.data = mappedData;
  //   if (this.top10AdUnitsDataSource.paginator) {
  //     this.top10AdUnitsDataSource.paginator.firstPage();
  //     // this.dataSource.paginator.lastPage();
  //   }
  // }
}
