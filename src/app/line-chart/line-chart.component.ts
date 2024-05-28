import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { UsersService } from '../users.service';
import { response } from 'express';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent implements OnInit {

  selectedFile: File | null = null;
  uploadMessage ='';

  constructor(private uploadService: UsersService) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadMessage = '';
  }

  uploadInvoice() {
    if (!this.selectedFile) {
      this.uploadMessage = 'Please select a PDF file to upload.';
      return;
    }

    this.uploadService.uploadInvoice(this.selectedFile).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('Invoice uploaded successfully!');
          // ... handle successful upload
        } else {
          console.error('Upload failed:', response.message);
          // ... handle upload error
        }
      },
      (error) => {
        console.error('Error uploading file:', error.message);
        //this.uploadService.logoutUser(error.error.error);
      }
    );
  }

}