import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder , FormsModule, NgForm, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { adOptions, countries } from '../sign-up-dropdown';
import { MessageService } from 'primeng/api';
import { url } from 'inspector';
import { Location } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { reCaptchaPublicKey, reCaptchaSiteKey } from '../../environment/environment';





@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  aFormGroup!: FormGroup;
  siteKey: string='';

  Name = '';
  Email = '';
  Phone = '';
  Country = '';
  app_url = '';
  app_active_users!: number;
  app_select1 = '';
  app_select2 = '';
  web_url = '';
  web_active_users!: number;
  page_views!: number;
  web_select2 = '';
  invited = '';
  countriesOption: any;
  adOption: any;
  created_by = '';

  nameTextLength  = false;
  emailTextLength  = false;
  phoneTextLength = false;
  appUrlTextLength = false;
  webUrlTextLength = false;

  AdminLoggedIn = false;
  hideBackButton = false;


  res = '';
  submitted = false;


  appGameChecked: boolean = true;
  websiteChecked: boolean = false;

  recaptchaError = true;

  captchaToken = '';


  constructor(@Inject(PLATFORM_ID) public platformId: Object, private formBuilder: FormBuilder, private userService: UsersService, private router: Router, private messageService: MessageService) { }


  ngOnInit(): void {
    this.siteKey = reCaptchaSiteKey;
    this.captchaToken = '';
    // console.log('Site key is: ', this.siteKey);
    
    if (isPlatformBrowser(this.platformId)) {
      this.aFormGroup = this.formBuilder.group({
          recaptcha: ['', Validators.required]
      });
  } else {
      // Initialize form without recaptcha on the server side
      this.aFormGroup = this.formBuilder.group({});
  }
    //console.log('Game', this.appGameChecked);
    //console.log('web', this.websiteChecked);
    this.countriesOption = countries;
    this.adOption = adOptions;
   
    if(typeof localStorage != 'undefined' && (this.userService.getType()=='Admin' || this.userService.getType()=='AdOpsManager') ) {
      if(localStorage.length > 0) {
        this.hideBackButton = true;
      }
    }
    
    // console.log('hidden is: ', this.hideBackButton);
    
  }

  handleSuccess(captchaResponse: string) {
    // console.log(`Resolved response token: ${captchaResponse}`);
    this.captchaToken = captchaResponse;
   
  }

  isPlatformBrowser(platformId: Object): boolean {
    return isPlatformBrowser(platformId);
}

  
  back() {
    this.router.navigate(['/contacts']);
  }

  onAppGameClicked() {
    this.appGameChecked = true;
    this.websiteChecked = false;
    //console.log('Game', this.appGameChecked);
    //console.log('web', this.websiteChecked);
  }

  onWebsiteClicked() {
    this.websiteChecked = true;
    this.appGameChecked = false;
    //console.log('Game', this.appGameChecked);
    //console.log('web', this.websiteChecked);
  }

  checkNameTextLength() {
    if(this.Name.length >500) {
      this.nameTextLength = true;
    }
    else {
      this.nameTextLength = false;
    }
  }

  checkEmailTextLength() {
    if(this.Email.length >500) {
      this.emailTextLength = true;
    }
    else {
      this.emailTextLength = false;
    }
  }

  checkPhoneTextLength() {
    if(this.Phone.length > 15) {
      this.phoneTextLength = true;
    }
    else {
      this.phoneTextLength = false;
    }
  }
  checkAppUrlTextLength() {
    if(this.app_url.length >2000 ) {
      this.appUrlTextLength = true;
    }
    else {
      this.appUrlTextLength = false;
    }
  }

  checkWebUrlTextLength() {
    if(this.web_url.length > 2000 ) {
      this.webUrlTextLength = true;
    }
    else {
      this.webUrlTextLength = false;
    }
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    const recaptchaControl = this.aFormGroup.get('recaptcha');

    if (recaptchaControl?.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please complete the reCAPTCHA', life: 5000 });
      this.submitted = false;
      return;
    }

    // const recaptchaToken = recaptchaControl?.value;

    if (this.nameTextLength  || this.emailTextLength  || this.phoneTextLength || this.appUrlTextLength || this.webUrlTextLength ) {
      // alert('Error in input size length inserted');
      this.submitted = false;
      // console.log('Inside if block');
      
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter valid input sizes', life: 5000 });
    }
    else {

      console.log('form is: ', form.valid);


      this.created_by = this.Name;

      if (typeof localStorage != undefined) {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const tempVar = JSON.parse(userData);
          this.created_by = tempVar.User_Name;
        }
      }

      
      if (form.valid) {
        const RegisteredData = {
          mail: this.Email,
          name: this.Name
        }
        localStorage.removeItem('RegisteredUser');
        localStorage.setItem('RegisteredUser', JSON.stringify(RegisteredData));
        if (this.appGameChecked) {
          const user_app_data = {
            Name: this.Name,
            Email_id: this.Email,
            Phone_No: this.Phone,
            Country: this.Country,
            Product_Type: 'A',
            URL: this.app_url,
            Est_Daily_User: this.app_active_users,
            App_Mediation_Platform: this.app_select1,
            Web_Monthly_Page_View: 0,
            Top_Country: this.app_select2,
            status: 'Approval Required',
            invited: 'N',
            created_by: this.created_by,
            'g-recaptcha-response':  this.captchaToken
          }
          console.log('Data: ', user_app_data);
          

          this.userService.saveUser(user_app_data).subscribe(
            (response) => {
              console.log('user App Data saved succesfully: ', response);
              this.router.navigate(['/add-site-1']);
              // localStorage.clear();
              this.res = 'ok';
              console.log("Res value is : ", this.res);

            },
            (error) => {
              console.log('Error Saving user App data: ', error);
              this.res = 'no';
              this.userService.logoutUser(error.error.error);
              console.log('Res value is: ', this.res);
              this.submitted = false;

              // alert("Technical Error Occured !!!");
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Technical Error Occured !!!', life: 5000 });
            }

          )
          //alert('Sign up complete');
        }

        if (this.websiteChecked) {

          const user_website_data = {
            Name: this.Name,
            Email_id: this.Email,
            Phone_No: this.Phone,
            Country: this.Country,
            Product_Type: 'W',
            URL: this.web_url,
            Est_Daily_User: this.web_active_users,
            App_Mediation_Platform: 0,
            Web_Monthly_Page_View: this.page_views,
            Top_Country: this.web_select2,
            status: 'Approval Required',
            invited: 'N',
            created_by: this.created_by,
            'g-recaptcha-response':  this.captchaToken
          }

          console.log('Data: ', user_website_data);
          this.userService.saveUser(user_website_data).subscribe(
            (response) => {
              console.log('user Web Data saved succesfully: ', response);
              this.router.navigate(['/add-site-1']);
              localStorage.clear();
              this.res = 'ok';
              console.log("Res value is : ", this.res);

            },
            (error) => {
              console.log('Error Saving user Web data: ', error);
              this.res = 'no';
              this.userService.logoutUser(error.error.error);
              console.log('Res value is: ', this.res);
              this.submitted = false;

              // alert("Technical Error Occured !!!");
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Technical Error Occured !!!', life: 5000 });
            }
          )
        }
      }
      else {
        console.log('Form is invalid. Please check the fields.');
        this.submitted = false;
        // alert('Please fill all values correctly');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all fields correctly', life: 5000 });
        
      }
    }
  }


}
