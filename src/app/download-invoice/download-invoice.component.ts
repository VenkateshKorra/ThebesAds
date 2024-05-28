import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MessageService } from 'primeng/api';


export interface userPayment {
  id: any;
  total_revenue: any;
  revenue_share: any
  deduction: any;
  payable_amount: any; //

}

@Component({
  selector: 'app-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrl: './download-invoice.component.css'
})
export class DownloadInvoiceComponent implements OnInit, AfterViewInit {
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

  total_revenue_calculated = 0;
  total_deduction = 0;
  total_payable_amount = 0;
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
      console.log('id is: ',this.id);
      

      // Optionally remove the item from localStorage
      localStorage.removeItem('navigationState');
    } 
    else {
      console.log('Id not received');
      
    }


    // this.account_id = this.route.snapshot.data['state']?.data;
    this.fetchData();
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

  fetchData() {
    const Data = {
      user_type: 'Publisher',
      user_id: this.id
    }
    this.userService.getUserPaymentData(Data).subscribe(
      (response) => {
        const mappedUsers: userPayment[] = response.map((user: any, index: any) => ({
          id: index + 1,
          total_payment: user.Total_Payment,
          revenue_share: user.Ad_Serving_Cost,
          deduction: user.Deductions,
          payable_amount: Math.floor(user.Total_Payment * user.Ad_Serving_Cost + user.Deductions)
        }));


        this.userPaymentData = mappedUsers;
        this.fetchedPaymentData = true;
        // console.log(this.userPaymentData);

        this.calculateTotal();

        // console.log(this.userPaymentData);
      },
      (error) => {
        console.log('error', error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error, life: 5000 });
      }
    )
  }

  calculateTotal() {
    for (let i = 0; i < this.userPaymentData.length; i++) {
      this.total_revenue_calculated += this.userPaymentData[i].total_payment
      this.total_deduction += this.userPaymentData[i].deduction;
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
