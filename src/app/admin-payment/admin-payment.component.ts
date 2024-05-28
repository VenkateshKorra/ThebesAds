import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http'
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UsersService } from '../users.service';
import { NavigationExtras, Router } from '@angular/router';




export interface PaymentData {
  invoice_upload_date: any;
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
  payment_made: string;
  download: string;
  upload: string;
  filePath: string; 
  isUploaded: boolean;
  fileUploaded: boolean;
  // payment_made: boolean; 
}

@Component({
  selector: 'app-admin-payment',
  templateUrl: './admin-payment.component.html',
  styleUrl: './admin-payment.component.css'
})
export class AdminPaymentComponent implements OnInit {
  fileUploaded: boolean = false;
  @ViewChild('canvas1') canvas1!: ElementRef<HTMLCanvasElement>;
  paymentData: any[] = []; // Stores the payment data
  // chart: Chart | undefined;
  

  displayedColumns: string[] = [ 'month', 'publisher_name',  'publisher_networkcode', 'total_payment', 'parent_payment', 'child_payment', 'deduction', 'ad_serving_cost','delegation_type','invoice_upload_data','download','upload','payment_data','payment_made'];
  dataSource = new MatTableDataSource<PaymentData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  onPaymentMadeChange: any;

  selectedFile: File | null = null;
  uploadMessage ='';

  constructor(private userService: UsersService , private messageService : MessageService, private route:  Router ) { }
  
  ngOnInit(): void {
    this.fetchPaymentData();
  }

  fetchPaymentData() {
    const Data={
      user_type: 'Admin',
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
        
        console.log('File path is: ', mappedUsers[0].filePath);
        
      },
      error: (error) => {
        console.error('Failed to fetch payment data', error);
        //this.userService.logoutUser(error.error.error);
        // alert("Error fetching payment data");
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 5000  });
      }
    });
  }
   
  updatePaymentStatus(element: PaymentData) {
  
    const temp = element.payment_made ? 1: 0;

    const Data = {
      publisher_id :element.publisher_id, 
      payment_made: temp,
      month : element.month
    }

    this.userService.adminpayment(Data).subscribe(
      (response) => {
        console.log('Payment Made updated', response);
        
        this.fetchPaymentData();
      },
      (error) => {
        console.log('Error occured', error);
        //this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 5000  });
      }
    )
  }
  deleteInvoice(element: PaymentData) {
    // console.log('FilePath is: ',element.filePath);
    const Data = {
      filePath : element.filePath,
      publisher_id: element.publisher_id, 
      month: element.month
    }
    
    this.userService.deleteInvoice(Data).subscribe(
      (response) => {
        console.log('File deleted successfully');
        element.filePath = ''; 
        element.invoice_upload_date = 'NA';// Remove file path for this row only
        const fileInput = document.getElementById('fileInput' + element.publisher_id) as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          this.fetchPaymentData();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File deleted successfully', life: 5000 });
      },
      (error) => {
        console.error('Error deleting file', error);
        //this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete file', life: 5000 });
      }
    );
  }

  onFileSelected(event: any, element: PaymentData) {
    console.log('element data is: ', element);
    this.selectedFile = event.target.files[0];
    this.uploadMessage = '';
    this.uploadInvoice(element); // Pass the element to uploadInvoice
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
    console.log('upload data is',Data);
    this.userService.uploadInvoice(Data).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('Invoice uploaded successfully!', response.filePath);
          element.filePath = response.filePath;
          element.isUploaded= true
          element.invoice_upload_date = new Date().toISOString();
          // element.fileUploaded = true;// Set file path for this row only
          this.fetchPaymentData();
        } else {
          console.error('Upload failed:', response.message);
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File Upload Successfully', life: 5000 });
      },
      (error) => {
        console.error('Error uploading file:', error.message);
        //this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error uploading file' + error.error, life: 5000 });
      }
      
    );
    this.selectedFile = null;
    
  }

//   downloadInvoice(filePath: string) {
//     // Construct download URL based on the file path

//     const startIndex = filePath.indexOf('uploads/');
//     const relativePath = filePath.substring(startIndex);
//     const downloadUrl = `http://localhost/${relativePath}`;

//     // Open the download link in a new tab/window
//     window.open(downloadUrl, '_blank');
// }

getDownloadLink(filePath: string): string {
  const startIndex = filePath.indexOf('uploads/');
  const relativePath = filePath.substring(startIndex);
  return `http://localhost/${relativePath}`;
}


showFileInput(element: PaymentData): void {
  const fileInput = document.getElementById('fileInput' + element.publisher_id) as HTMLInputElement;
  fileInput.click();
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

downloadPDF(element: PaymentData) {
  const navigationExtras: NavigationExtras = {
    state: {
      id: element.publisher_id,
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


}