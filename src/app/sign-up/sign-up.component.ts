import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { adOptions, countries } from '../sign-up-dropdown';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  aFormGroup!: FormGroup;
  siteKey: string = "6LdJJ_MpAAAAABSC_VsvW7R2HgkNavuP0axlBATw";
  submitted = false;
  recaptchaError = true;

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

  nameTextLength = false;
  emailTextLength = false;
  phoneTextLength = false;
  appUrlTextLength = false;
  webUrlTextLength = false;

  res = '';

  appGameChecked: boolean = true;
  websiteChecked: boolean = false;
  processFormSubmission: any;
  isBrowser: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private router: Router,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.aFormGroup = this.formBuilder.group({
        recaptcha: ['', Validators.required]
      });

      this.countriesOption = countries;
      this.adOption = adOptions;
      this.initializeFormControls();
    }
  }

  initializeFormControls() {
    this.Name = '';
    this.Email = '';
    this.Phone = '';
    this.Country = '';
    this.app_url = '';
    this.app_active_users = 0;
    this.app_select1 = '';
    this.app_select2 = '';
    this.web_url = '';
    this.web_active_users = 0;
    this.page_views = 0;
    this.web_select2 = '';
    this.invited = '';
    this.created_by = '';
    this.nameTextLength = false;
    this.emailTextLength = false;
    this.phoneTextLength = false;
    this.appUrlTextLength = false;
    this.webUrlTextLength = false;
    this.res = '';
    this.appGameChecked = true;
    this.websiteChecked = false;
    this.recaptchaError = true;
  }

  onAppGameClicked() {
    this.appGameChecked = true;
    this.websiteChecked = false;
  }

  onWebsiteClicked() {
    this.websiteChecked = true;
    this.appGameChecked = false;
  }

  checkNameTextLength() {
    this.nameTextLength = this.Name.length > 500;
  }

  checkEmailTextLength() {
    this.emailTextLength = this.Email.length > 500;
  }

  checkPhoneTextLength() {
    this.phoneTextLength = this.Phone.length > 15;
  }

  checkAppUrlTextLength() {
    this.appUrlTextLength = this.app_url.length > 2000;
  }

  checkWebUrlTextLength() {
    this.webUrlTextLength = this.web_url.length > 2000;
  }

  handleSuccess(token: string) {
    this.recaptchaError = false;
  }

  onSubmit(form: NgForm) {
    if (this.submitted) {
      return;
    }

    this.submitted = true;
    const recaptchaControl = this.aFormGroup.get('recaptcha');

    if (recaptchaControl?.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please complete the reCAPTCHA', life: 5000 });
      this.submitted = false;
      return;
    }

    const recaptchaToken = recaptchaControl?.value;

    const payload = {
      Name: this.Name,
      Email_id: this.Email,
      Phone_No: this.Phone,
      Country: this.Country,
      Product_Type: this.appGameChecked ? 'A' : 'W',
      URL: this.appGameChecked ? this.app_url : this.web_url,
      Est_Daily_User: this.appGameChecked ? this.app_active_users : this.web_active_users,
      App_Mediation_Platform: this.appGameChecked ? this.app_select1 : 0,
      Web_Monthly_Page_View: this.websiteChecked ? this.page_views : 0,
      Top_Country: this.appGameChecked ? this.app_select2 : this.web_select2,
      status: 'Approval Required',
      invited: 'N',
      created_by: this.created_by,
      recaptchaResponse: recaptchaToken
    };

    this.userService.saveUser(payload).subscribe(
      (response) => {
        this.router.navigate(['/add-site-1']);
        localStorage.clear();
        this.res = 'ok';
      },
      (error) => {
        this.res = 'no';
        this.submitted = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Technical Error Occured !!!', life: 5000 });
      }
    );
  }
}
