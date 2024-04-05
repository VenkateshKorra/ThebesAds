import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { UsersService } from '../users.service';
import { response } from 'express';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  @Input() options!: any;

  apiData:any[] =  [];

  constructor(private userService: UsersService) {}

  public chart: any;

  ngAfterViewInit(): void {
    if(this.options=='impressions') {
      this.impressionChart();
    }
    else if(this.options =='bar') {
      this.barChart();
    }
    else if(this.options=="barHorizontal") {
      this.barHorizontalChart();
    }
    else {
      this.createChart();
    }
    
  }

  createChart() {
    const ctx = this.canvas.nativeElement.getContext('2d');

    this.chart = new Chart(ctx!, {
        type: 'line', //this denotes tha type of chart
  
        data: {// values on X-Axis
          labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
                   '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
           datasets: [
            {
              label: "Sales",
              data: ['467','576', '572', '79', '92',
                   '574', '573', '576'],
              backgroundColor: '#235fa9a2', 
              fill: true,
              tension: 0.3,
              borderColor: '#707070',
              borderWidth: 1
            },
            // {
            //   label: "Profit",
            //   data: ['542', '542', '536', '327', '17',
            //          '0.00', '538', '541'],
            //   backgroundColor: 'limegreen'
            // }  

            
          ]
        },
        options: {
          aspectRatio:2.5
        }
        
      });
    }

    impressionChart() {
      const ctx = this.canvas.nativeElement.getContext('2d');
  
      this.userService.get_daily_ad_unit_wise().subscribe(
        (response) => {
          console.log('Data received from daily_ad_unit');
          this.apiData = response;
  
          const labels = this.apiData.map(entry => entry.Date);
          const data = this.apiData.map(entry => entry.Total_impressions);
  
          this.chart = new Chart(ctx!, {
            type: 'line', // this denotes the type of chart
            data: {
              // values on X-Axis
              labels: labels,
              datasets: [{
                label: 'Impressions',
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
        },
        (error) => {
          console.log('Error receiving data from daily_ad_unit');
        }
      );
    }


    barChart() {
      const ctx = this.canvas.nativeElement.getContext('2d');
  
      this.chart = new Chart(ctx!, {
          type: 'bar', //this denotes tha type of chart
    
          data: {// values on X-Axis
            labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
                     '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
             datasets: [
              {
                label: "Sales",
                data: ['467','576', '572', '79', '92',
                     '574', '573', '576'],
                backgroundColor: '#0856A2', 
                // fill: true,
                // tension: 0.3,
                borderColor: '#707070',
                borderWidth: 1,
                barThickness: 25, 
                
              },
              // {
              //   label: "Profit",
              //   data: ['542', '542', '536', '327', '17',
              //          '0.00', '538', '541'],
              //   backgroundColor: 'limegreen'
              // }  
  
              
            ]
          },
          options: {
            aspectRatio:2.5
          }
          
        });
      }


      barHorizontalChart() {
        const ctx = this.canvas.nativeElement.getContext('2d');
    
        this.chart = new Chart(ctx!, {
            type: 'bar', //this denotes tha type of chart
      
            data: {// values on X-Axis
              labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
                       '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
               datasets: [
                {
                  label: "Sales",
                  data: ['467','576', '572', '79', '92',
                       '574', '573', '576'],
                  backgroundColor: '#0B4E9A', 
                  // fill: true,
                  // tension: 0.3,
                  borderColor: '#707070',
                  borderWidth: 1, 
                  barThickness: 5, 
                  
                },
                // {
                //   label: "Profit",
                //   data: ['542', '542', '536', '327', '17',
                //          '0.00', '538', '541'],
                //   backgroundColor: 'limegreen'
                // }  
    
                
              ]
            },
            options: {
              aspectRatio:2.5,
              indexAxis: 'y', 
             
          
            }
            
          });
        }
  





}