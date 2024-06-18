import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MessageService } from 'primeng/api';


export interface userPayment {
  id: any;
  total_payment: any;
  ad_serving_cost_calculated: any
  deduction: any;
  payable_amount: any; //

}

@Component({
  selector: 'app-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrl: './download-invoice.component.css'
})
export class DownloadInvoiceComponent implements OnInit, AfterViewInit{
  userPaymentData: any;


  billed_from = '';
  name = '';
  address = '';
  contact_person = '';
  date = '';
  invoice_no = '';
  billed_to = '';
  billed_to_address = "605-062 A2Z, Business Centre Al Nahda 1  Dubai UAE-22169";
  trn_no = '100305918300003';
  email_id = 'info@thebeglobal.com';
  ad_serving_cost = 0;

  total_revenue_calculated = 0;
  total_deduction = 0;
  total_payable_amount = 0;
  total_ad_serving_cost=0;
  numberToWord = '';

  bank_account_no: any;
  account_holder_name = '';
  ifsc_code = '';
  pan = '';
  branch_address = '';
  swift_code = '';
  account_id: any;

  data: any;

  route_account_id: any;

  fetchedAccountInfo = false;
  fetchedPaymentData = false;
  id ='';
  total_impression =0;
  date_received = '';
  month ='';
  year = '';


  constructor(private userService: UsersService, private router: Router, private route: ActivatedRoute, private messageService: MessageService) {
    const navigation = router.getCurrentNavigation();
    // if (navigation && navigation.extras.state) {
    //   const id = navigation.extras.state['id'];
    //   console.log('Id is: ', id);
    // }
  }
  @ViewChild('container') container!: ElementRef;

  ngOnInit(): void {
    
    const navigationState = localStorage.getItem('navigationState');
    if (navigationState) {
      const state = JSON.parse(navigationState);
      this.id = state.id;
      this.name = state.name;
      this.date_received = state.date;
      this.extractMonthAndYear(this.date_received);
      console.log('id is: ',this.id);
      console.log('Name is: ', this.name);

      // Optionally remove the item from localStorage
      // localStorage.removeItem('navigationState');
    } 
    else {
      console.log('Id not received');
      
    }


    // this.account_id = this.route.snapshot.data['state']?.data;
    
    this.fetchData();
    this.getBilledFrom();
    // this.account_id = localStorage.getItem('setPublisherId') || '';
    this.getAccountInfo();

  }

  ngAfterViewInit(): void {
    if (this.fetchedPaymentData && this.fetchedAccountInfo && this.userPaymentData) {
      this.generatePDF();
    } else {
      // Handle the case where data might still be fetching:
      console.log('Data is still being fetched. Waiting for both account and payment data...');
    }
  }

  getBilledFrom() {
    const Data = {
      account_id: this.id
    }
    this.userService.get_address_contact(Data).subscribe(
      (response) => {
        console.log('address contacts data: ', response);
        console.log('address: ', response.data.address);
        
        
        this.address = response.data.address;
        this.contact_person = response.data.contact;
        
      }, 
      (error) => {
        console.log('Error: ', error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000 });
      }
    )
  }

  getAccountInfo() {
    const Data = {
      // account_id:  this.account_id
      account_id: this.id
    }
    this.userService.getPaymentInfo(Data).subscribe(
      (response) => {
        this.bank_account_no = response.Account_Number;
        this.account_holder_name = response.Account_Holder_Name;
        this.ifsc_code = response.Bank_Code;
        this.pan = response.Pan_Number;
        this.branch_address = response.Bank_address;
        this.swift_code = response.SWIFT_Code;
        this.fetchedAccountInfo = true;

        this.callGeneratePdf();

      },
      (error) => {
        console.log('error', error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 5000 });
      }
    )
  }

  extractMonthAndYear(date: string): void {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [year, month] = date.split('-');
    this.month = months[parseInt(month, 10) - 1];
    this.year = year;
  }



  fetchData() {
    const Data = {
      Publisher_Id: this.id,
      Month: this.month,
      Year: this.year
    };
  
    console.log('Data send in fetch data is: ', Data);
  
    this.userService.get_user_invoice_data(Data).subscribe(
      (response) => {
        console.log('Response of fetch Data: ', response);
  
        // Check if response is an object
        if (typeof response === 'object' && !Array.isArray(response)) {
          // Convert response object to an array with a single element
          const mappedUsers: userPayment[] = [
            {
              id: 1, // Set id to 1 as it's the only element
              total_payment: response.data.Total_Payment,
              ad_serving_cost_calculated: response.data.calculated_serving_cost,
              deduction: response.data.Deductions,
              payable_amount: Math.floor(Number(response.data.Total_Payment) + Number(response.data.Deductions) + response.data.calculated_serving_cost)
            }
          ];
          console.log('mapped data is: ', mappedUsers);
          
          this.userPaymentData = mappedUsers;
        } else {
          console.error('Unexpected response format. Expected an object.');
        }
  
        this.fetchedPaymentData = true;
        console.log(this.userPaymentData);
        this.calculateTotal();
      },
      (error) => {
        console.error('error', error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail:'Error: '+ error.error.error, life: 5000 });
      }
    );
  }


  calculateTotal() {
    for (let i = 0; i < this.userPaymentData.length; i++) {
      this.total_revenue_calculated += Number(this.userPaymentData[i].total_payment);
      this.total_deduction += Number(this.userPaymentData[i].deduction);
      this.total_ad_serving_cost += this.userPaymentData[i].ad_serving_cost_calculated;
      this.total_payable_amount += this.userPaymentData[i].payable_amount;
    }
    //  this.convertToWords(this.total_payable_amount);
    this.numberToWord = this.convertNumberToWordsDollars(this.total_payable_amount);
    // console.log('number to word is: ', this.numberToWord);
    this.callGeneratePdf();
  }

  callGeneratePdf() {
    if (this.fetchedAccountInfo && this.fetchedPaymentData && this.numberToWord) {
      setTimeout(() => {
        this.ngAfterViewInit();
      }, 1500);

    }

  }

  async generatePDF() {
    if (!this.container || !this.container.nativeElement) {
      console.error('Container not available.');
      return;
    }

    const data = this.container.nativeElement; // Assuming the container element holds the invoice content

    await html2canvas(data, { scale: 1.5 }) // Adjust scale as needed for better quality
      .then(canvas => {
        let imgWidth = 208;
        let pageHeight = 275;
        let imgHeight = pageHeight;
        let heightLeft = imgHeight;
        const imgData = canvas.toDataURL('image/png');
        const doc = new jsPDF();
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Adjust positioning as needed
        doc.save('invoice.pdf');
      })
      .catch(error => {
        console.error('Error generating PDF:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 5000 });
      });
  }

  convertNumberToWordsDollars(number: number): string {
    const units: string[] = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens: string[] = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens: string[] = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands: string[] = ['', 'Thousand', 'Million', 'Billion'];

    // Function to convert a three-digit number into words
    function convertThreeDigits(num: number): string {
      let result: string = '';
      const hundredDigit: number = Math.floor(num / 100);
      const remainder: number = num % 100;
      if (hundredDigit !== 0) {
        result += units[hundredDigit] + ' Hundred ';
      }
      if (remainder !== 0) {
        if (remainder < 10) {
          result += units[remainder];
        } else if (remainder < 20) {
          result += teens[remainder - 10];
        } else {
          const tenDigit: number = Math.floor(remainder / 10);
          const unitDigit: number = remainder % 10;
          result += tens[tenDigit];
          if (unitDigit !== 0) {
            result += ' ' + units[unitDigit];
          }
        }
      }
      return result;
    }

    if (number === 0 || number < 0) {
      return 'Zero Dollars';
    }

    let result: string = '';
    let chunkIndex: number = 0;

    while (number > 0) {
      const chunk: number = number % 1000;
      if (chunk !== 0) {
        const chunkWords: string = convertThreeDigits(chunk);
        result = chunkWords + ' ' + thousands[chunkIndex] + ' ' + result;
      }
      number = Math.floor(number / 1000);
      chunkIndex++;
    }

    return result.trim() + " Dollars";
  }
}
