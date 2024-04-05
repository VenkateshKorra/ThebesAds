import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { Chart } from 'chart.js';
import { timeOptions, metricsOptions } from '../admin-dashboard-dropdown';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

interface DataObject {
  position: number;
  name: string;
  sites: string;
  apps: string;
  ad_units: string;
  revenue: string;
  deduction: string;
  publisher: string;
  network: string;
  impressions: string;
  click: string;
  ecpm: string;
}

const ELEMENT_DATA: DataObject[] = [
  { position: 1, name: 'Hydrogen', sites: 'site1', apps: 'app1', ad_units: 'adunits1', revenue: '100', deduction: '10', publisher: 'Publisher1', network: 'Network1', impressions: '1000', click: '50', ecpm: '10' },
  { position: 2, name: 'Helium', sites: 'site2', apps: 'app2', ad_units: 'adunits2', revenue: '200', deduction: '20', publisher: 'Publisher2', network: 'Network2', impressions: '2000', click: '100', ecpm: '20' },
  { position: 3, name: 'Lithium', sites: 'site3', apps: 'app3', ad_units: 'adunits3', revenue: '300', deduction: '30', publisher: 'Publisher3', network: 'Network3', impressions: '3000', click: '150', ecpm: '30' },
  { position: 4, name: 'Beryllium', sites: 'site4', apps: 'app4', ad_units: 'adunits4', revenue: '400', deduction: '40', publisher: 'Publisher4', network: 'Network4', impressions: '4000', click: '200', ecpm: '40' },
  { position: 5, name: 'Boron', sites: 'site5', apps: 'app5', ad_units: 'adunits5', revenue: '500', deduction: '50', publisher: 'Publisher5', network: 'Network5', impressions: '5000', click: '250', ecpm: '50' },
  { position: 6, name: 'Carbon', sites: 'site6', apps: 'app6', ad_units: 'adunits6', revenue: '600', deduction: '60', publisher: 'Publisher6', network: 'Network6', impressions: '6000', click: '300', ecpm: '60' },
  { position: 7, name: 'Nitrogen', sites: 'site7', apps: 'app7', ad_units: 'adunits7', revenue: '700', deduction: '70', publisher: 'Publisher7', network: 'Network7', impressions: '7000', click: '350', ecpm: '70' },
  { position: 8, name: 'Oxygen', sites: 'site8', apps: 'app8', ad_units: 'adunits8', revenue: '800', deduction: '80', publisher: 'Publisher8', network: 'Network8', impressions: '8000', click: '400', ecpm: '80' },
  { position: 9, name: 'Fluorine', sites: 'site9', apps: 'app9', ad_units: 'adunits9', revenue: '900', deduction: '90', publisher: 'Publisher9', network: 'Network9', impressions: '9000', click: '450', ecpm: '90' },
  { position: 10, name: 'Neon', sites: 'site10', apps: 'app10', ad_units: 'adunits10', revenue: '1000', deduction: '100', publisher: 'Publisher10', network: 'Network10', impressions: '10000', click: '500', ecpm: '100' }
];


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'sites', 'apps', 'ad_units', 'revenue', 'deduction', 'publisher', 'network', 'impressions', 'click', 'ecpm'];
  dataSource = new MatTableDataSource<DataObject>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  adUnitSelect = '';
  siteSelect = '';
  publisherSelect='';
  appSelect='';
  time_period = 'last 7 days';
  overall_metrics='revenue';
  device_metrics='revenue';
  country_metrics='revenue';
  userName: any;
  impressions: any;
  clicks: any;
  revenue: any;
  fill_rate: any;
  ctr: any;
  cpm: any;
  total_viewable = '';
  ad_requests = 0;
  ad_response = 0;
  error_rate = 0;
  new_publishers = 0;
  new_sites = 0;
  new_apps = 0;
  time_period_options: any;
  metrics_options: any;

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

  currentDate = new Date();
  year = this.currentDate.getFullYear();
  month = this.currentDate.getMonth() + 1;
  day = this.currentDate.getDate();
  date = `${this.year}-${this.month < 10 ? '0' + this.month : this.month}-${this.day < 10 ? '0' + this.day : this.day}`;

  constructor(private userService: UsersService) { }

  //tells dropdown 
  publisherDropdownVisible: boolean = false;
  adUnitDropdownVisible: boolean = false;
  siteDropdownVisible: boolean = false;
  appDropdownVisible: boolean = false;


  //contains data values
  adUnitDropDown: string[] = [];
  siteDropDown: string[] = [];
  publisherDropDown: string[]=[];
  appDropDown: string[]=[];


  publisherFilteredOptions: string[] = [];
  adUnitFilteredOptions: string[] = [];
  siteFilteredOptions: string[] = [];
  appFilteredOptions: string[] = [];

  ngOnInit(): void {   // initalize with the component
    this.time_period_options= timeOptions;
    this.metrics_options = metricsOptions;
    this.userName = typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null;
    if(this.userName!= null && this.userName!=undefined) {
      this.get_daily_data();
      if (this.userName!=undefined && this.userName!= null) {
        this.get_dropdowns();
        console.log('Inside ngOninit name is : ', this.userName);
      }
      // else {
      //   window.location.reload();
      //   this.ngAfterViewInit();
      //   console.log('Inside ngOninit else name is : ', this.userName);
      // }
    }
    else {
      // window.location.reload();
      console.log('Inside ngOninit else name is : ', this.userName);
    }
    this.know_dropdown_value();
    // console.log('user name in adMin dashboard is ', this.userName);
}
    // this.userName = typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null;
    // console.log('Inside onInit', this.userName);



  ngAfterViewInit(): void {  // initialize after component is alive
    this.dataSource.paginator = this.paginator; // paginator for tables
    if(this.userName!=undefined && this.userName != null) {
      if (this.adUnitSelect == '' && this.siteSelect == '') {
        // console.log('Inside AfterViewInit: ', this.userName);
        const Data = {
          name: this.userName,
          date: this.date,
          time_period: this.time_period, 
          type:'publisher'
        }
        this.get_daily_publisher_revenue(Data);
        this.get_daily_publisher_device(Data);
        this.get_daily_publisher_country(Data);
      }
    }
  }

  know_dropdown_value() {
    // setInterval(() => {
    //   console.log(`Publisher is: ${this.publisherSelect}, ad Unit is: ${this.adUnitSelect}, site is: ${this.siteSelect}, app is: ${this.appSelect} `);
    // }, 5000);
  }

  toggleDropdown(text: any) {  //make adUnit dropdown visible  
    if(text=='publisher') {
      this.publisherDropdownVisible = !this.publisherDropdownVisible;
      this.publisherFilteredOptions = this.publisherDropDown;
      this.adUnitDropdownVisible = false;
      this.siteDropdownVisible = false;
      this.appDropdownVisible = false;
    } 
    else if(text =='ad unit') {
      this.adUnitDropdownVisible = !this.adUnitDropdownVisible;
      this.adUnitFilteredOptions = this.adUnitDropDown;
      this.publisherDropdownVisible = false;
      this.siteDropdownVisible = false;
      this.appDropdownVisible = false;
    } 
    else if(text == 'site' ) {
      this.siteDropdownVisible = !this.siteDropdownVisible;
      this.siteFilteredOptions = this.siteDropDown;
      this.publisherDropdownVisible = false;
      this.adUnitDropdownVisible = false;
      this.appDropdownVisible = false;

    }
    else if(text == 'app') {
      this.appDropdownVisible = !this.appDropdownVisible;
      this.appFilteredOptions = this.appDropDown;
      this.publisherDropdownVisible = false;
      this.adUnitDropdownVisible = false;
      this.siteDropdownVisible = false;
    }

  }

  publisherFilter(searchTerm: Event) {  // filter adunit for value
    const search = (searchTerm.target as HTMLInputElement).value;
    if (!search) {
      this.publisherFilteredOptions = this.publisherDropDown;
    } else {
      this.publisherFilteredOptions = this.publisherDropDown.filter(option => option.toLowerCase().includes(search.toLowerCase()));
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

  publisherSelectOption(value: string) {  //assign adunit with the selected value
    this.publisherSelect = value;
    // console.log("Ad Unit Selected Option:", value);
    this.adUnitSelect='';
    this.appSelect='';
    this.siteSelect = '';
    this.publisherDropdownVisible = false;
    console.log(`Publisher is: ${this.publisherSelect}, ad Unit is: ${this.adUnitSelect}, site is: ${this.siteSelect}, app is: ${this.appSelect}, time_period is: ${this.time_period} `);
    this.get_daily_data();
    const Data = {
      ad_unit: this.publisherSelect,
      time_period: this.time_period,
      date: this.date,
      type: 'admin'
    }
    // console.log('called adUnit charts');
    // this.get_publisher_revenue(Data);
    // this.get_publisher_device(Data);
    // this.get_publisher_country(Data);
  }

  adUnitSelectOption(value: string) {  //  assign site with the selected value
    this.adUnitSelect = value;
    // console.log("Site Selected Option:", value);
    this.publisherSelect = '';
    this.appSelect='';
    this.siteSelect = '';
    this.adUnitDropdownVisible = false;
    console.log(`Publisher is: ${this.publisherSelect}, ad Unit is: ${this.adUnitSelect}, site is: ${this.siteSelect}, app is: ${this.appSelect}, time_period is: ${this.time_period} `);
    this.get_daily_data();
    const Data = {
      ad_unit: this.adUnitSelect,
      time_period: this.time_period,
      date: this.date,
      type: 'admin'
    }
    this.get_adUnit_revenue(Data);
    this.get_adUnit_device(Data);
    this.get_adUnit_country(Data);
    
  }

  siteSelectOption(value: string) {  //  assign site with the selected value
    this.siteSelect = value;
    // console.log("Site Selected Option:", value);
    this.adUnitSelect = '';
    this.appSelect='';
    this.publisherSelect = '';
    this.siteDropdownVisible = false;
    console.log(`Publisher is: ${this.publisherSelect}, ad Unit is: ${this.adUnitSelect}, site is: ${this.siteSelect}, app is: ${this.appSelect}, time_period is: ${this.time_period} `);
    this.get_daily_data();
    const Data = {
      site_name: this.siteSelect,
      time_period: this.time_period,
      date: this.date,
      type: 'admin'
    }
    this.get_site_revenue(Data);
    this.get_site_device(Data);
    this.get_site_country(Data);
  }

  appSelectOption(value: string) {  //  assign site with the selected value
    this.appSelect = value;
    // console.log("Site Selected Option:", value);
    this.adUnitSelect = '';
    this.publisherSelect='';
    this.siteSelect = '';
    this.appDropdownVisible = false;
    console.log(`Publisher is: ${this.publisherSelect}, ad Unit is: ${this.adUnitSelect}, site is: ${this.siteSelect}, app is: ${this.appSelect}, time_period is: ${this.time_period} `);
    this.get_daily_data();
    const Data = {
      app_name: this.appSelect,
      time_period: this.time_period,
      date: this.date,
      type: 'admin'
    }
    // this.get_app_revenue(Data);
    // this.get_app_device(Data);
    // this.get_app_country(Data);
  }

  onTimePeriodChange() { // time_period change updation
    this.get_daily_data();
    this.ngAfterViewInit();
    if (this.adUnitSelect) {
      this.adUnitSelectOption(this.adUnitSelect);
    }
    if (this.siteSelect) {
      this.siteSelectOption(this.siteSelect);
    }
    if(this.publisherSelect)  {
      this.publisherSelectOption(this.publisherSelect);
    }
     if(this.appSelect) {
      this.appSelectOption(this.appSelect);
     }
  }

  get_daily_data() {  
    if (this.publisherSelect =='' &&  this.adUnitSelect == '' && this.siteSelect == '' && this.appSelect == '') {
        const Data = {
            name: this.userName,
            time_period: this.time_period, 
            type: 'admin', 
            date: this.date
        };
        this.userService.get_daily_publisher(Data).subscribe(
            (response) => {
                this.setMetrics(response);
                console.log('Data got as response is: ', response);
                
            },
            (error) => {
                alert('Error getting data: '+ error.error.error);
            }
        );
    } else if (this.publisherSelect =='' &&  this.adUnitSelect != '' && this.siteSelect == '' && this.appSelect == '') {
        const Data = {
            ad_unit: this.adUnitSelect,
            time_period: this.time_period, 
            type: 'admin',
            date: this.date
        };
        this.userService.get_daily_adunit(Data).subscribe(
            (response) => {
                this.setMetrics(response);
                console.log('Data got as response is: ', response);
            },
            (error) => {
              alert('Error getting data: '+ error.error.error);
            }
        );
    } else if (this.publisherSelect =='' &&  this.adUnitSelect == '' && this.siteSelect != '' && this.appSelect == '') {
        const Data = {
            site: this.siteSelect,
            time_period: this.time_period, 
            type: 'admin',
            date: this.date
        };
        this.userService.get_daily_site(Data).subscribe(
            (response) => {
                this.setMetrics(response);
                console.log('Data got as response is: ', response);
            },
            (error) => {
              alert('Error getting data: '+ error.error.error);
            }
        );
    } else if (this.publisherSelect =='' &&  this.adUnitSelect == '' && this.siteSelect == '' && this.appSelect != '') {
      const Data = {
          site: this.siteSelect,
          time_period: this.time_period, 
          type: 'admin',
          date: this.date
      };
      this.userService.get_daily_site(Data).subscribe(
          (response) => {
              this.setMetrics(response);
              console.log('Data got as response is: ', response);
          },
          (error) => {
            alert('Error getting data: '+ error.error.error);
          }
      );
    } else {
        this.setDefaultMetrics();
    }
}

setMetrics(response: any) {
    this.impressions = response.total_impressions || 0;
    this.clicks = response.total_clicks || 0;
    this.revenue = response.total_revenue || 0;
    this.fill_rate = response.fill_rate || 0;
    this.ctr = response.ctr || 0;
    this.cpm = response.cpm || 0;
    this.error_rate = response.total_error || 0;
    this.ad_requests = response.total_ad_requests || 0;
    this.ad_response = response.total_ad_response || 0;
    this.new_publishers = 0;
    this.new_apps = 0;
    this.new_sites = 0;
}

setDefaultMetrics() {
    this.impressions = 0;
    this.clicks = 0;
    this.revenue = 0;
    this.fill_rate = 0;
    this.ctr = 0;
    this.cpm = 0;
    this.error_rate = 0;
    this.ad_requests = 0;
    this.ad_response = 0;
    this.new_publishers = 0;
    this.new_apps = 0;
    this.new_sites = 0;
}

  get_dropdowns() {  // get dropdownn values from adUnits table
    const Data = {
      account: ""
    }
    this.userService.get_adUnits_in_user_dashboard(Data).subscribe(
      (response) => {
        console.log('Response from site_adUnit dropdowns are:  ', response);
        this.siteDropDown = response.data.map((item: any) => item.site_name)
        this.adUnitDropDown = response.data.map((item: any) => item.ad_unit_name)
        this.publisherDropDown= this.adUnitDropDown;
        this.appDropDown = this.adUnitDropDown;
        this.siteDropDown = [...new Set(this.siteDropDown)];

      },
      (error) => {
        // console.log("Error getting ad Units and sites");
        alert('Error: ' + error.error.error);
      }
    )
  }
  // Charts From here
  impressionChart() {  // draws section two chart
    if (this.chart1) {
      this.chart1.destroy(); // Destroy existing chart if it exists
    }
    const ctx = this.canvas1.nativeElement.getContext('2d');
    const labels = this.apiData1.map(entry => entry.Date);
    const data = this.apiData1.map(entry => entry.Total_impressions);
    this.chart1 = new Chart(ctx!, {
      type: 'line', // this denotes the type of chart
      data: {
        // values on X-Axis
        labels: labels,
        datasets: [{
          label: 'Revenue',
          data: data,
          backgroundColor: '#235fa9a2',
          fill: true,
          tension: 0.3,
          borderColor: '#707070',
          borderWidth: 1
        }],
      },
      options: {
        aspectRatio: 2.5
      }
    });

  }
  barChart() {  // draws section three chart
    if (this.chart2) {
      this.chart2.destroy(); // Destroy existing chart if it exists
    }
    const ctx = this.canvas2.nativeElement.getContext('2d');
    const labels = this.apiData2.map(entry => entry.Device);
    const data = this.apiData2.map(entry => entry.Total_impressions);
    this.chart2 = new Chart(ctx!, {
      type: 'bar', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: labels,
        datasets: [
          {
            label: "Impressions",
            data: data,
            backgroundColor: '#0856A2',
            borderColor: '#707070',
            borderWidth: 1,
            barThickness: 5,
          },
        ]
      },
      options: {
        aspectRatio: 2,
        indexAxis: 'y'
      }
    });
  }
  barHorizontalChart() {  // draws section four chart
    if (this.chart3) {
      this.chart3.destroy(); // Destroy existing chart if it exists
    }
    const ctx = this.canvas3.nativeElement.getContext('2d');
    const labels = this.apiData3.map(entry => entry.country);
    const data = this.apiData3.map(entry => entry.Total_impressions);
    this.chart3 = new Chart(ctx!, {
      type: 'bar', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: labels,
        datasets: [
          {
            label: "Impressions",
            data: data,
            backgroundColor: '#0B4E9A',
            borderColor: '#707070',
            borderWidth: 1,
            barThickness: 5,
          },
        ]
      },
      options: {
        aspectRatio: 2,
        indexAxis: 'y'
      }
    });
  }

  get_daily_publisher_revenue(Data: any) { // calls revenue chart
    this.userService.get_daily_publisher_revenue(Data).subscribe(
      (response) => {
        // console.log('Response publisher revenue is', response);
        this.apiData1 = response
        this.impressionChart();
      },
      (error) => {
        // console.log('Error in getting publisher revenue chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }

  get_daily_publisher_device(Data: any) { // calls device chart
    this.userService.get_daily_publisher_device(Data).subscribe(
      (response) => {
        // console.log('Response publisher device is', response);
        this.apiData2 = response
        this.barChart();
      },
      (error) => {
        // console.log('Error in getting publisher device chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }

  get_daily_publisher_country(Data: any) { // calls country chart
    this.userService.get_daily_publisher_country(Data).subscribe(
      (response) => {
        // console.log('Response publisher country is', response);
        this.apiData3 = response
        this.barHorizontalChart();
      },
      (error) => {
        // console.log('Error in getting publisher country chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }

  get_adUnit_revenue(Data: any) {
    this.userService.get_adUnit_revenue(Data).subscribe(
      (response) => {
        // console.log('Response adUnit revenue is', response);
        this.apiData1 = [];
        this.apiData1 = response;
        // console.log('Data received at adUnit revenue', response);
        this.impressionChart();
      },
      (error) => {
        // console.log('Error in getting adunit revenue chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }
  get_adUnit_device(Data: any) {
    this.userService.get_adUnit_device(Data).subscribe(
      (response) => {
        // console.log('Response adUnit country is', response);
        this.apiData2 = [];
        this.apiData2 = response;
        // console.log('Data received at adUnit device', response);
        this.barChart();
      },
      (error) => {
        // console.log('Error in getting adunit device chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }
  get_adUnit_country(Data: any) {
    this.userService.get_adUnit_country(Data).subscribe(
      (response) => {
        // console.log('Response adUnit country is', response);
        this.apiData3 = [];
        this.apiData3 = response;
        // console.log('Data received at adUnit country', response);
        this.barHorizontalChart();
      },
      (error) => {
        // console.log('Error in getting adunit country chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }

  get_site_revenue(Data: any) {
    this.userService.get_site_revenue(Data).subscribe(
      (response) => {
        // console.log('Response site revenue is', response);
        this.apiData1 = [];
        this.apiData1 = response;
        // console.log('Data received at site revenue', response);
        this.impressionChart();
      },
      (error) => {
        // console.log('Error in getting site revenue chart data', error);
        alert('Error: ' + error.error.error);
      }
    )

  }
  get_site_device(Data: any) {
    this.userService.get_site_device(Data).subscribe(
      (response) => {
        // console.log('Response site device is', response);
        this.apiData2 = [];
        this.apiData2 = response;
        // console.log('Data received at site device', response);
        this.barChart();
      },
      (error) => {
        // console.log('Error in getting site device chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }
  get_site_country(Data: any) {
    this.userService.get_site_country(Data).subscribe(
      (response) => {
        // console.log('Response site country is', response);
        this.apiData3 = [];
        this.apiData3 = response;
        // console.log('Data received at site country', response);
        this.barHorizontalChart();
      },
      (error) => {
        // console.log('Error in getting site country chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }
}

