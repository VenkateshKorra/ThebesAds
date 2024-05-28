import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, Output, Input } from '@angular/core';
import { UsersService } from '../users.service';
import Chart from 'chart.js/auto';
import { timeOptions, metricsOptions } from '../admin-dashboard-dropdown';
import { filter } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrl: './report-download.component.css'
})
export class ReportDownloadComponent {


  // adUnitSelect = '';
  // siteSelect = '';
  // appSelect = '';
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
  error_rate: any;
  ad_response: any;
  ad_request: any;
  total_viewable: any;
  viewable_impressions =0;
  measurable_impressions = 0;

  userType='';
  pub_id ='';



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

  currentDate = new Date();
  year = this.currentDate.getFullYear();
  month = this.currentDate.getMonth() + 1;
  day = this.currentDate.getDate();
  date = `${this.year}-${this.month < 10 ? '0' + this.month : this.month}-${this.day < 10 ? '0' + this.day : this.day}`;

  constructor(private userService: UsersService, private renderer: Renderer2, private elementRef: ElementRef, private messageService: MessageService) { }

  filterSelected : any;

  responseData: any; // This will store the 'response' data
  overallMetricsData: any; // This will store the 'overallMetrics' data
  deviceMetricsData: any; // This will store the 'deviceMetrics' data
  countryMetricsData: any; // This will store the 'countryMetrics' data

  ngOnInit(): void {   // initalize with the component
    this.time_period_options = timeOptions;
    this.metrics_options = metricsOptions;
    const filterRecived = typeof localStorage !== 'undefined' ? localStorage.getItem('Filter'): null;
    this.filterSelected = filterRecived;
    const idReceived = typeof localStorage !=='undefined' ? localStorage.getItem('Id'): null;
    this.account_id = idReceived;
    this.userName = typeof localStorage !== 'undefined' ? localStorage.getItem('userName') : null;
    this.userType = this.userService.getType();
    this.pub_id = this.userService.getAccountId();
    
      if (this.userName != undefined && this.userName != null) {
        // this.get_dropdowns();
        // console.log('Inside ngOninit name is : ', this.userName);
        // console.log(`Name is ${this.userName}, account Id is ${this.account_id}`);
        if(this.userService.getType()=='Admin'){}
        const Data = {
          name: this.userName,
          id: parseInt(this.account_id),
          Pub_id: parseInt(this.pub_id),
          time_period: this.time_period,
          type: 'publisher',
          date: this.date,
          filter: this.filterSelected
        };
        this.get_daily_data(Data);
      }
    // }
    else {
      // window.location.reload();
      // console.log('Inside ngOninit else name is : ', this.userName);
    }
  }

  ngAfterViewInit(): void {  // initialize after component is alive
    // if (this.userName != undefined && this.userName != null) {
    //   // if (this.adUnitSelect == '' && this.siteSelect == '') {
    //     // console.log('Inside AfterViewInit: ', this.userName);
    //     const Data = {
    //       name: this.userName,
    //       date: this.date,
    //       account_id: this.account_id,
    //       time_period: this.time_period,
    //       type: 'publisher'
    //     }
    //     this.get_daily_publisher_revenue(Data);
    //     this.get_daily_publisher_device(Data);
    //     this.get_daily_publisher_country(Data);
    //   }
    // }
  }

  clearFilter() {

    this.time_period = 'last_7_days';
    this.onTimePeriodChange();
  }


  onTimePeriodChange() { // time_period change updation
    const Data = {
      name: this.userName,
      id: parseInt(this.account_id),
      Pub_id: parseInt(this.pub_id),
      time_period: this.time_period,
      type: 'publisher',
      date: this.date,
      filter: this.filterSelected
    };
    this.get_daily_data(Data);

  }

  get_daily_data(Data: any) {

    if(this.userType=='Admin')  {
      this.userService.get_Admin(Data).subscribe(
        (response) => {
          // console.log('Data Received in daily_data is: ', response);
          // Store each part of the JSON response in the corresponding variable
          this.responseData = response.response; // Storing 'response' data
          this.overallMetricsData = response.overallMetrics; // Storing 'overallMetrics' data
          this.deviceMetricsData = response.deviceMetrics; //  Storing 'deviceMetrics' data
          this.countryMetricsData = response.countryMetrics; // Storing 'countryMetrics' data
          // console.log('Response Data is: ', this.responseData);
          this.setMetrics(this.responseData);
          this.revenue_chart(this.overallMetricsData);
          this.device_chart(this.deviceMetricsData);
          this.country_chart(this.countryMetricsData);
  
        },
        (error) => {
          // console.log('Error in getting data: ', error);
          // alert('Error: '+error.error.error);
          this.userService.logoutUser(error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 5000  });
  
          this.setDefaultMetrics();
          this.responseData = ''; // Storing 'response' data
          this.overallMetricsData = ''; // Storing 'overallMetrics' data
          this.deviceMetricsData = ''; // Storing 'deviceMetrics' data
          this.countryMetricsData = '';
  
        }
      )
    }
    else {
      this.userService.get_publisher(Data).subscribe(
        (response) => {
          // console.log('Data Received in daily_data is: ', response);
          // Store each part of the JSON response in the corresponding variable
          this.responseData = response.response; // Storing 'response' data
          this.overallMetricsData = response.overallMetrics; // Storing 'overallMetrics' data
          this.deviceMetricsData = response.deviceMetrics; //  Storing 'deviceMetrics' data
          this.countryMetricsData = response.countryMetrics; // Storing 'countryMetrics' data
          // console.log('Response Data is: ', this.responseData);
          this.setMetrics(this.responseData);
          this.revenue_chart(this.overallMetricsData);
          this.device_chart(this.deviceMetricsData);
          this.country_chart(this.countryMetricsData);
  
        },
        (error) => {
          // console.log('Error in getting data: ', error);
          // alert('Error: '+error.error.error);
          this.userService.logoutUser(error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 5000  });
  
          this.setDefaultMetrics();
          this.responseData = ''; // Storing 'response' data
          this.overallMetricsData = ''; // Storing 'overallMetrics' data
          this.deviceMetricsData = ''; // Storing 'deviceMetrics' data
          this.countryMetricsData = '';
  
        }
      )
    }

    
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
      this.viewable_impressions = Number(data.Total_Active_viewable_impressions);
      this.measurable_impressions = Number(data.Total_Active_measurable_impressions);
    }
  }


  setDefaultMetrics() {
    this.impressions = 0;
    this.clicks = 0;
    this.revenue = 0;
    this.fill_rate = 0;
    this.ctr = 0;
    this.cpm = 0;
    this.error_rate = 0;
    this.ad_request =  0;
    this.ad_response =  0;
    this.total_viewable = 0;
    this.viewable_impressions = 0;
    this.measurable_impressions = 0;
    // this.error_rate = 0;
    // this.ad_requests = 0;
    // this.ad_response = 0;
    // this.new_publishers = 0;
    // this.new_apps = 0;
    // this.new_sites = 0;
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
    // this.apiData2 = this.deviceMetricsData.map((entry: any) => ({
    //   device: entry.device,
    //   metrics: entry.Total_Impressions
    //  }));

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
              precision:2, 
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              callback: function(val, index) {
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
              precision:2, 
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              callback: function(val, index) {
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
    if(this.nextButton ==0) {
      this.previousButton = this.nextButton;
      this.nextButton  = 10;
    }
    else if(this.nextButton >=10) {
      this.previousButton = this.nextButton-10;
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
              precision:2, 
              // For a category axis, the val is the index so the lookup via getLabelForValue is needed
              callback: function(val, index) {
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
    
    if(this.nextButton!=0) {
      this.nextButton = this.nextButton - 10;
      this.country_chart(this.countryMetricsData);
    }
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in downloading CSV File', life: 5000  });

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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in downloading CSV File', life: 5000  });
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in downloading CSV File', life: 5000  });
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
