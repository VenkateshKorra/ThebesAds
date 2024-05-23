import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { countries } from '../sign-up-dropdown';
import { UsersService } from '../users.service';
import { StatusOptions } from '../admin-dashboard-dropdown';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-account-detail-admin',
  templateUrl: './account-detail-admin.component.html',
  styleUrl: './account-detail-admin.component.css'
})
export class AccountDetailAdminComponent implements OnInit {
  // country="India";
   Name: any;
   Status='';
   Margin ='';
   Country='';
   Phone='';
   Email ='';
   countries_options:any;
   userDetails: any;
   statusOptions: any;

   account_id : any;
   payment_method = '';
   payment_term ='';
   bank_name = '';
   swift_code = '';
   bank_address = '';
   bank_zipcode = '';
   bank_code = '';
   branch_name ='';
   account_number  = '';
   account_type ='';
   account_holder_name ='';

   Active = true;


  constructor(private userService: UsersService, private messageService: MessageService ) {}

  ngOnInit(): void {
    this.statusOptions = StatusOptions
    this.countries_options = countries;
      this.userDetails = this.userService.getUserDetails();
      this.Name = this.userDetails.publisher_name;
      this.Status= this.userDetails.status;
      this.Margin = this.userDetails.margin;
      this.Country= this.userDetails.country;
      this.Email = this.userDetails.email;
      this.Phone = this.userDetails.phone;
      console.log('User Name is: ', this.Name);

    this.account_id = localStorage.getItem('setPublisherId') || '';
    console.log('account id is: ', this.account_id);
    this.fetchPaymentData();
    
      
  }

  fetchPaymentData() {
    const Data = {
      account_id:  this.account_id
    }
    this.userService.getPaymentInfo(Data).subscribe(
      (response) => {
        // console.log('Payment details are: ', response);
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
        // console.log('Accont no: ', this.account_number);
        // console.log(typeof(this.account_number));
        
      }, 
      (error) =>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in getting payment details', life: 5000  });
      }
    )
  }

  onSubmit(form: NgForm) {

    // console.log('Form data : ', form);
    this.Active = false;
    
    if(form.valid) {
      const Data = {
        account_id: this.account_id,
        payment_method : this.payment_method,
        payment_term: this.payment_term,
        bank_name: this.bank_name,
        swift_code: this.swift_code,
        bank_address: this.bank_address,
        bank_zipcode: this.bank_zipcode,
        bank_code: this.bank_code,
        branch_name: this.branch_name,
        account_number: this.account_number,
        account_type: this.account_type,
        account_holder_name: this.account_holder_name
      }

      this.userService.savePaymentInfo(Data).subscribe(
        (response) => {
          // this.setDefault();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message, life: 5000 });
          this.fetchPaymentData();
            this.Active = true;
        }, 
        (error) => {
          this.Active = true;
          this.setDefault();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in saving Payment Info', life: 5000  });
        }
      )
    }
    else {
      this.Active = true;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all fields correctly', life: 5000  });
    }
    // this.Active = true;
  }

  setDefault() {
   this.account_id = '';
   this.payment_method = '';
   this.payment_term ='';
   this.bank_name = '';
   this.swift_code = '';
   this.bank_address = '';
   this.bank_zipcode = '';
   this.bank_code = '';
   this.branch_name ='';
   this.account_number = '';
   this.account_type ='';
   this.account_holder_name ='';
  }

}
