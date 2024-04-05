import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { Chart } from 'chart.js';
import { timeOptions, metricsOptions } from '../admin-dashboard-dropdown';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {

  adUnitSelect = '';
  siteSelect = '';
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

  constructor(private userService: UsersService, private renderer: Renderer2) { }

  adUnitDropdownVisible: boolean = false;
  siteDropdownVisible: boolean = false;
  appDropdownVisible: boolean = false;

  adUnitDropDown: string[] = [];
  siteDropDown: string[] = [];
  appDropDown: string[]=[];

  
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
    }
    else {
      console.log('Inside ngOninit else name is : ', this.userName);
    }
}

  ngAfterViewInit(): void {  // initialize after component is alive
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

  toggleDropdown(text: any) {  //make adUnit dropdown visible  
    if(text =='ad unit') {
      this.adUnitDropdownVisible = !this.adUnitDropdownVisible;
      this.adUnitFilteredOptions = this.adUnitDropDown;
      this.siteDropdownVisible = false;
      this.appDropdownVisible = false;
    } 
    else if(text == 'site' ) {
      this.siteDropdownVisible = !this.siteDropdownVisible;
      this.siteFilteredOptions = this.siteDropDown;
      this.adUnitDropdownVisible = false;
      this.appDropdownVisible = false;

    }
    else if(text == 'app') {
      this.appDropdownVisible = !this.appDropdownVisible;
      this.appFilteredOptions = this.appDropDown;
      this.adUnitDropdownVisible = false;
      this.siteDropdownVisible = false;
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

  adUnitSelectOption(value: string) {  //  assign site with the selected value
    this.adUnitSelect = value;
    // console.log("Site Selected Option:", value);
    this.appSelect='';
    this.siteSelect = '';
    this.adUnitDropdownVisible = false;
    console.log(`AD Unit is : ${this.adUnitSelect}, Site is : ${this.siteSelect}, time period is: ${this.time_period} `);
    this.get_daily_data();
    const Data = {
      ad_unit: this.adUnitSelect,
      time_period: this.time_period,
      date: this.date, 
      type:'publisher'
    }
    console.log('called adUnit charts');
    this.get_adUnit_revenue(Data);
    this.get_adUnit_device(Data);
    this.get_adUnit_country(Data);
  }

  siteSelectOption(value: string) {  //  assign site with the selected value
    this.siteSelect = value;
    // console.log("Site Selected Option:", value);
    this.adUnitSelect = '';
    this.appSelect='';
    this.siteDropdownVisible = false;
    console.log(`AD Unit is : ${this.adUnitSelect}, Site is : ${this.siteSelect}, time period is: ${this.time_period} `);
    this.get_daily_data();
    const Data = {
      site_name: this.siteSelect,
      time_period: this.time_period,
      date: this.date, 
      type:'publisher'
    }
    this.get_site_revenue(Data);
    this.get_site_device(Data);
    this.get_site_country(Data);
  }

  appSelectOption(value: string) {  //  assign site with the selected value
    this.appSelect = value;
    // console.log("Site Selected Option:", value);
    this.adUnitSelect = '';
    this.siteSelect='';
    this.appDropdownVisible = false;
    // console.log(`AD Unit is : ${this.adUnitSelect}, Site is : ${this.siteSelect}, time period is: ${this.time_period} `);
    this.get_daily_data();
    const Data = {
      app_name: this.appSelect,
      time_period: this.time_period,
      date: this.date,
      type: 'publisher'
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
     if(this.appSelect) {
      this.appSelectOption(this.appSelect);
     }
  }

  get_daily_data() {  // get metrics of first section
    if (this.adUnitSelect == '' && this.siteSelect == '') {
      const Data = {
        name: this.userName,
        time_period: this.time_period, 
        date:  this.date,
        type: 'publisher'
      }
      // console.log('UserName is: ', this.userName);

      this.userService.get_daily_publisher(Data).subscribe(
        (response) => {
          console.log("Got data from daily_publisher", response);
          this.impressions = response.total_impressions;
          this.clicks = response.total_clicks;
          this.revenue = response.total_revenue;
          this.fill_rate = response.fill_rate;
          this.ctr = response.ctr;
          this.cpm = response.cpm;
          if (this.impressions == null) {
            this.impressions = 0;
            this.clicks = 0;
            this.revenue = 0;
            this.fill_rate = 0;
            this.ctr = 0;
            this.cpm = 0
          }
        },
        (error) => {
          console.log('Error getting data from daily_publisher', error);
        }
      )
    }
    else if (this.adUnitSelect !== '' && this.siteSelect == '') {
      const Data = {
        ad_unit: this.adUnitSelect,
        time_period: this.time_period,
        date:  this.date,
        type: 'publisher'
      }
      this.userService.get_daily_adunit(Data).subscribe(
        (response) => {
          console.log("Got data from daily_adunit", response);
          this.impressions = response.total_impressions;
          this.clicks = response.total_clicks;
          this.revenue = response.total_revenue;
          this.fill_rate = response.fill_rate;
          this.ctr = response.ctr;
          this.cpm = response.cpm;
          if (this.impressions == null) {
            this.impressions = 0;
            this.clicks = 0;
            this.revenue = 0;
            this.fill_rate = 0;
            this.ctr = 0;
            this.cpm = 0
          }
        },
        (error) => {
          console.log('Error getting data from daily_adunit', error);
        }
      )
    }
    else if (this.adUnitSelect == '' && this.siteSelect !== '') {
      const Data = {
        site: this.siteSelect,
        time_period: this.time_period,
        date:  this.date,
        type: 'publisher'
      }
      this.userService.get_daily_site(Data).subscribe(
        (response) => {
          console.log("Got data from daily_site", response);
          this.impressions = response.total_impressions;
          this.clicks = response.total_clicks;
          this.revenue = response.total_revenue;
          this.fill_rate = response.fill_rate;
          this.ctr = response.ctr;
          this.cpm = response.cpm;
          if (this.impressions == null) {
            this.impressions = 0;
            this.clicks = 0;
            this.revenue = 0;
            this.fill_rate = 0;
            this.ctr = 0;
            this.cpm = 0
          }
        },
        (error) => {
          console.log('Error getting data from daily_site', error);
        }
      )
    }
    else {
      this.impressions = 0;
      this.clicks = 0;
      this.revenue = 0;
      this.fill_rate = 0;
      this.ctr = 0;
      this.cpm = 0;
    }

  }

  get_dropdowns() {  // get dropdownn values from adUnits table
    const Data = {
      account: this.userName
    }
    this.userService.get_adUnits_in_user_dashboard(Data).subscribe(
      (response) => {
        console.log('Response from site_adUnit is:  ', response);
        this.siteDropDown = response.data.map((item: any) => item.site_name);
        this.adUnitDropDown = response.data.map((item: any) => item.ad_unit_name);
        this.appDropDown = this.adUnitDropDown;
        this.siteDropDown = [...new Set(this.siteDropDown)];
      },
      (error) => {
        console.log("Error getting ad Units and sites");
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
        aspectRatio: 2.5,
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
        aspectRatio: 2.5,
        indexAxis: 'y'
      }
    });
  }

  get_daily_publisher_revenue(Data: any) { // calls revenue chart
    this.userService.get_daily_publisher_revenue(Data).subscribe(
      (response) => {
        console.log('Response publisher revenue is', response);
        this.apiData1 = response
        this.impressionChart();
      },
      (error) => {
        console.log('Error in getting publisher revenue chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }

  get_daily_publisher_device(Data: any) { // calls device chart
    this.userService.get_daily_publisher_device(Data).subscribe(
      (response) => {
        console.log('Response publisher device is', response);
        this.apiData2 = response
        this.barChart();
      },
      (error) => {
        console.log('Error in getting publisher device chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }

  get_daily_publisher_country(Data: any) { // calls country chart
    this.userService.get_daily_publisher_country(Data).subscribe(
      (response) => {
        console.log('Response publisher country is', response);
        this.apiData3 = response
        this.barHorizontalChart();
      },
      (error) => {
        console.log('Error in getting publisher country chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }

  get_adUnit_revenue(Data: any) {
    this.userService.get_adUnit_revenue(Data).subscribe(
      (response) => {
        console.log('Response adUnit revenue is', response);
        this.apiData1 = [];
        this.apiData1 = response;
        console.log('Data received at adUnit revenue', response);
        this.impressionChart();
      },
      (error) => {
        console.log('Error in getting adunit revenue chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }
  get_adUnit_device(Data: any) {
    this.userService.get_adUnit_device(Data).subscribe(
      (response) => {
        console.log('Response adUnit country is', response);
        this.apiData2 = [];
        this.apiData2 = response;
        console.log('Data received at adUnit device', response);
        this.barChart();
      },
      (error) => {
        console.log('Error in getting adunit device chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }
  get_adUnit_country(Data: any) {
    this.userService.get_adUnit_country(Data).subscribe(
      (response) => {
        console.log('Response adUnit country is', response);
        this.apiData3 = [];
        this.apiData3 = response;
        console.log('Data received at adUnit country', response);
        this.barHorizontalChart();
      },
      (error) => {
        console.log('Error in getting adunit country chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }

  get_site_revenue(Data: any) {
    this.userService.get_site_revenue(Data).subscribe(
      (response) => {
        console.log('Response site revenue is', response);
        this.apiData1 = [];
        this.apiData1 = response;
        console.log('Data received at site revenue', response);
        this.impressionChart();
      },
      (error) => {
        console.log('Error in getting site revenue chart data', error);
        alert('Error: ' + error.error.error);
      }
    )

  }
  get_site_device(Data: any) {
    this.userService.get_site_device(Data).subscribe(
      (response) => {
        console.log('Response site device is', response);
        this.apiData2 = [];
        this.apiData2 = response;
        console.log('Data received at site device', response);
        this.barChart();
      },
      (error) => {
        console.log('Error in getting site device chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }
  get_site_country(Data: any) {
    this.userService.get_site_country(Data).subscribe(
      (response) => {
        console.log('Response site country is', response);
        this.apiData3 = [];
        this.apiData3 = response;
        console.log('Data received at site country', response);
        this.barHorizontalChart();
      },
      (error) => {
        console.log('Error in getting site country chart data', error);
        alert('Error: ' + error.error.error);
      }
    )
  }


  

}
