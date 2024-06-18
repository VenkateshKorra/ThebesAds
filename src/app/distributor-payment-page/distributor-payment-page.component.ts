import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';
import { NavigationExtras, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

export interface PaymentData {
  month: string;
  publisher_id: string;
  publisher_name: string;
  publisher_networkcode: string;
  total_payment: string;
  parent_payment: string;
  child_payment: string;
  deduction: string;
  ad_serving_cost: string;
  delegation_type: string;
  invoice_generation_data: string
  invoice_upload_data: string
  payment_data: string;
  payment_mode: string;
  download: string;
  upload: string;
  filePath: string; 
}

export interface RevenueData {
  month: string;
  publisherName: string;
  publisherRevenue: any;
  beGross:any;
  distributorGross: any;
  publisherMargin: any;
  // distributorMargin: any;
}

@Component({
  selector: 'app-distributor-payment-page',
  templateUrl: './distributor-payment-page.component.html',
  styleUrl: './distributor-payment-page.component.css'
})
export class DistributorPaymentPageComponent implements OnInit {
  typeOfUser = '';
  paymentData: any[] = []; // Stores the payment data
  account_id = '';

  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  date = new Date();
  currentYear = this.date.getFullYear();
  getMonth = this.date.getMonth();
  currentMonth = "";

  RevenueEarned = 0;

  displayedColumns: string[] = ['month', 'publisher_id', 'publisher_name', 'publisher_networkcode', 'delegation_type', 'total_payment', 'deduction', 'ad_serving_cost',  'child_payment',  'parent_payment',  'invoice_upload_data', 'payment_data', 'download', 'upload'];

  displayRevenue: string[] = ['month', 'publisherName', 'publisherRevenue', 'beGross', 'distributorGross'];
  dataSource = new MatTableDataSource<PaymentData>();
  RevenueDataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private userService: UsersService, private messageService: MessageService, private route: Router) { }

  selectedFile: File | null = null;
  uploadMessage ='';
  ngOnInit(): void {
    this.currentMonth = this.monthNames[this.getMonth];
    console.log(`Current Month is: ${this.currentMonth} and current date is: ${this.currentYear}`);
    
    this.typeOfUser = this.userService.getType();
    if (typeof localStorage != 'undefined') {
      this.account_id = this.userService.getAccountId();
    }
    // console.log('publisher id is',this.publisher_id);
    this.fetchRevenueInfo();
    this.fetchPaymentData();

  }


  fetchPaymentData() {
    const Data={
      user_type: this.typeOfUser,
      user_id: this.userService.getAccountId()
    }
    this.userService.getUserPaymentData(Data).subscribe({
      next: (response) => {
        // this.paymentData = data;
        const mappedUsers: PaymentData[] = response.map((user: any) => ({
          month: user.Month,
          publisher_id:user.Publisher_Id,
          publisher_name: user.Publisher_Name,
          publisher_networkcode: user.Publisher_Networkcode,
          total_payment: user.Total_Payment,
          parent_payment: user.Parent_Payment,
          child_payment: user.Child_Payment,
          deduction: user.Deductions,
          ad_serving_cost: user.Ad_Serving_Cost,
          delegation_type: user.Delegation_Type,
          invoice_generation_data: user.Inv_Generation_Date,
          invoice_upload_data: user.Inv_Upload_Date=='0000-00-00 00:00:00'?'NA':user.Inv_Upload_Date,
          payment_data: user.Payment_Date=='0000-00-00 00:00:00'?'NA':user.Payment_Date,
          payment_made: user.Payment_Made == 0 ? false : true,
          download: '',
          upload: user.file_path? user.file_path: 'NA', 
          filePath: user.file_path? user.file_path: 'NA',
          fileName: user.file_path? user.file_path.substring(38) : 'NA',
        }));
        
        this.dataSource.data = mappedUsers;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();

          // this.dataSource.paginator.lastPage();
        }
        
        // console.log('File path is: ', mappedUsers[0].filePath);
        
      },
      error: (error) => {
        console.error('Failed to fetch payment data', error);
        this.userService.logoutUser(error.error.error);
        // alert("Error fetching payment data");
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 5000  });
      }
    });
  }

  fetchRevenueInfo() {
    const Data = {
      "Publisher_Id": this.typeOfUser,
      "Month": this.currentMonth,
      "Year": this.currentYear,
    }
    console.log('The data send is: ', Data);

    this.userService.get_publishers_revenue_info(Data).subscribe(
      (response) => {
        console.log('Response : ', response);
        const tempVar: RevenueData[] = response.data.map((user: any) => ({
          month: this.currentMonth + '-' + this.currentYear,
          publisherName: user.Account_Name,
          publisherRevenue: user.Total_Revenue,
          publisherMargin: user.Margin,
          beGross: user.BeGross ,
          distributorGross: user.DistributorGross

        }));

        this.RevenueDataSource.data = tempVar;

        tempVar.forEach(value  => {
          this.RevenueEarned +=Number(value.distributorGross);
        });
        
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();

          // this.dataSource.paginator.lastPage();
        }
        
      }, 
      (error) => {
        console.error('Failed to fetch Revenue data', error);
        this.userService.logoutUser(error.error.error);
        // alert("Error fetching payment data");
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 5000  });
      }
    )
    
  }
 
  
  deleteInvoice(element: PaymentData) {
    const Data = {
      filePath : element.filePath,
      publisher_id: element.publisher_id, 
      month: element.month
    }
    // console.log('FilePath is: ',element.filePath);
    
    this.userService.deleteInvoice(Data).subscribe(
      (response) => {
        console.log('File deleted successfully');
        element.filePath = ''; // Remove file path for this row only
        const fileInput = document.getElementById('fileInput' + element.publisher_id) as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          this.fetchPaymentData();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File deleted successfully', life: 5000 });
      },
      (error) => {
        console.error('Error deleting file', error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete file', life: 5000 });
      }
    );
  }

  onFileSelected(event: any, element: PaymentData) {
    this.selectedFile = event.target.files[0];
    this.uploadMessage = '';
    this.uploadInvoice(element); // Pass the element to uploadInvoice
  }
  getDownloadLink(filePath: string): string {
  const startIndex = filePath.indexOf('uploads/');
  const relativePath = filePath.substring(startIndex);
  const domain = this.userService.get_upload_domain();
  // console.log(`${domain}${relativePath}`);
  
  return `${domain}${relativePath}`;
}
  
  uploadInvoice(element: PaymentData) {
    if (!this.selectedFile) {
      this.uploadMessage = 'Please select a PDF file to upload.';
      return;
    }
    const Data = {
       selectedFile: this.selectedFile,
      publisher_id: element.publisher_id,
      month: element.month
    }
    this.userService.uploadInvoice(Data).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('Invoice uploaded successfully!', response.filePath);
          element.filePath = response.filePath;
          this.fetchPaymentData();
        } else {
          console.error('Upload failed:', response.message);
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File Upload Successfully', life: 5000 });
      },
      (error) => {
        console.error('Error uploading file:', error.message);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error uploading file' + error.error, life: 5000 });
      }
    );
    this.selectedFile = null;
  }

  downloadPDF(element: PaymentData) {
    const navigationExtras: NavigationExtras = {
      state: {
        id: element.publisher_id,
        name: element.publisher_name,
        date: element.month
      }
    };
    const baseUrl = window.location.origin;
    const route = '/download-invoice';
    const fullUrl = `${baseUrl}${route}`;
  
    // Set the state to be accessible in the new tab
    const stateData = JSON.stringify(navigationExtras.state);
    localStorage.setItem('navigationState', stateData);
  
    // Open the new tab
    window.open(fullUrl, '_blank');
    // this.route.navigate(['/download-invoice'], navigationExtras);
  }

  uploadButtonClicked(element: any) {
    const fileInput: HTMLInputElement = document.createElement('input');
    fileInput.type = 'file';
    
    fileInput.id='fileInput';
    fileInput.accept='.pdf';
  
    fileInput.addEventListener('change',(event)=> {
      this.onFileSelected(event, element)
    })
  
    fileInput.click();
  }
}
