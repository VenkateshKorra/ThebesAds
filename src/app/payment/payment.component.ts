import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';
import { NavigationExtras, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { response } from 'express';
import { error } from 'console';

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


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  paymentData: any[] = []; // Stores the payment data
  account_id = '';
  title = 'editable-text';

  isEditMode = false;
  downloadClicked= false;


  payment_method = '';
  payment_term = '';
  bank_name = '';
  swift_code = '';
  bank_address = '';
  bank_zipcode = '';
  bank_code = '';
  branch_name = '';
  account_number = '';
  account_type = '';
  account_holder_name = '';

  
  displayedColumns: string[] = ['month', 'publisher_id', 'publisher_name', 'publisher_networkcode', 'total_payment', 'parent_payment', 'child_payment', 'deduction', 'ad_serving_cost', 'delegation_type', 'invoice_upload_data', 'payment_data', 'download', 'upload'];
  dataSource = new MatTableDataSource<PaymentData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private userService: UsersService, private messageService: MessageService, private route: Router) { }
  
  selectedFile: File | null = null;
  uploadMessage ='';
  ngOnInit(): void {
    if (typeof localStorage != 'undefined') {
      this.account_id = this.userService.getAccountId();
    }
    // console.log('publisher id is',this.publisher_id);
    this.getAccountInfo();
    this.fetchPaymentData();

  }
  onSubmit(form: NgForm) {
    if(form.valid){
   const Data={
    account_id: 1,
    payment_method: this.payment_method,
    payment_term: this.payment_term,
    bank_name: this.bank_name,
    swift_code: this.swift_code,
    bank_address: this.bank_address,
    bank_zipcode: this.bank_zipcode,
    bank_code:this.bank_code,
    branch_name: this.branch_name,
    account_number: this.account_number,
    account_type: this.account_type,
    account_holder_name: this.account_holder_name
   }
   this.userService.updatePaymentInfo(Data).subscribe(
    (response)=>{
      this.isEditMode= false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Edit successful', life: 5000 });
    },
    (error)=>{
      this.isEditMode= false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error occured' + error, life: 5000 });
    }
   )
  }
  else{
    this.isEditMode= false;
    this.messageService.add({ severity: 'error', summary: 'Plase fill all input fields', life: 5000 });
  }
  }
  
  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    console.log('payment method',this.payment_method);
  }


  fetchPaymentData() {
    const Data = {
      user_type: 'Publisher',
      user_id: this.userService.getAccountId()
    }
    // console.log('Data sent to fetch User Payment Data is: ', Data);

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
          fileName: user.file_path? user.file_path.substring(38) : 'NA'
          
        }));
        this.dataSource.data = mappedUsers;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
          // this.dataSource.paginator.lastPage();
        }
      },
      error: (error) => {
        console.error('Failed to fetch payment data', error);
        // alert("Error fetching payment data");
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 5000 });
      }
    });
  }
 
  
  deleteInvoice(element: PaymentData) {
    // console.log('FilePath is: ',element.filePath);
    
    this.userService.deleteInvoice(element.filePath).subscribe(
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
  return `http://localhost/${relativePath}`;
}
  getAccountInfo() {
    const Data = {
      account_id: this.userService.getAccountId()
    }
    this.userService.getPaymentInfo(Data).subscribe(
      (response) => {
        this.payment_method = response.Payment_Method;
        this.payment_term = response.Payment_Term;
        this.bank_name = response.Bank_name;
        this.swift_code = response.SWIFT_Code;
        this.bank_address = response.Bank_address;
        this.bank_zipcode = response.Bank_Zipcode;
        this.bank_code = response.Bank_Code;
        this.branch_name = response.Branch_Name;
        this.account_number = response.Account_Number;
        this.account_type = response['Account _Type'];
        this.account_holder_name = response.Account_Holder_Name;
      },
      (error) => {
        console.log('Error in getting account details: ', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in getting account details' + error.error, life: 5000 });
      }
    )
  }

  uploadInvoice(element: PaymentData) {
    if (!this.selectedFile) {
      this.uploadMessage = 'Please select a PDF file to upload.';
      return;
    }
    const Data = {
      selectedFile: this.selectedFile,
      publisher_id: element.publisher_id
    }
    this.userService.uploadInvoice(Data).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('Invoice uploaded successfully!', response.filePath);
          element.filePath = response.filePath; // Set file path for this row only
          this.fetchPaymentData();
        } else {
          console.error('Upload failed:', response.message);
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File Upload Successfully', life: 5000 });
      },
      (error) => {
        console.error('Error uploading file:', error.message);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error uploading file' + error.error, life: 5000 });
      }
    );
    this.selectedFile = null;
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
  // save() {
  //   const data = {
  //     account_id: this.account_id,
  //     payment_method: this.payment_method,
  //     payment_term: this.payment_term,
  //     bank_name: this.bank_name,
  //     swift_code: this.swift_code,
  //     bank_address: this.bank_address,
  //     bank_zipcode: this.bank_zipcode,
  //     bank_code: this.bank_code,
  //     branch_name: this.branch_name,
  //     account_number: this.account_number,
  //     account_type: this.account_type,
  //     account_holder_name: this.account_holder_name
  //   };

  //   this.userService.updatePaymentInfo(data).subscribe(
  //     (response) => {
  //       if (response.success) {
  //         console.log('Record updated successfully');
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record updated successfully', life: 5000 });
  //         this.toggleEdit();
  //       } else {
  //         console.error('Error updating record:', response.error);
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating record: ' + response.error, life: 5000 });
  //       }
  //     },
  //     (error) => {
  //       console.error('HTTP Error:', error);
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'HTTP Error: ' + error.error, life: 5000 });
  //     }
  //   );
  // }
 

}