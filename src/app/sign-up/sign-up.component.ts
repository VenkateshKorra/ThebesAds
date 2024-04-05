import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { adOptions, countries } from '../sign-up-dropdown';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
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
  invited= '';
  countriesOption:any;
  adOption:any;


  res ='';
  submitted=false;


  appGameChecked: boolean = true;
  websiteChecked: boolean = false;


  constructor(private userService: UsersService, private router: Router) { }

  ngOnInit(): void {
    //console.log('Game', this.appGameChecked);
    //console.log('web', this.websiteChecked);
    this.countriesOption =countries;
    this.adOption = adOptions;

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

  onSubmit(form: NgForm) {
    /*
    console.log('Name is', this.Name);
    console.log('Email is ', this.Email);
    console.log('Phone is ', this.Phone);
    console.log('Country is ', this.Country);
     console.log('Hello');*/
    
    this.submitted=true;
   
    

    if (form.valid) {


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
        }

        this.userService.saveUser(user_app_data).subscribe(
          (response) => {
            console.log('user App Data saved succesfully: ', response);
            this.router.navigate(['/add-site-1']);
            this.res = 'ok';
            console.log("Res value is : ", this.res);
            
          },
          (error) => {
            console.log('Error Saving user App data: ', error);
            this.res= 'no';
            console.log('Res value is: ', this.res);
            
            alert("Technical Error Occured !!!");
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
        }
        this.userService.saveUser(user_website_data).subscribe(
          (response) => {
            console.log('user Web Data saved succesfully: ', response);
            this.router.navigate(['/add-site-1']);
            this.res = 'ok';
            console.log("Res value is : ", this.res);
            
          },
          (error) => {
            console.log('Error Saving user Web data: ', error);
            this.res= 'no';
            console.log('Res value is: ', this.res);
            
            alert("Technical Error Occured !!!");
          }

        )


      }
      // if(this.res=='ok') {
        // this.router.navigate(['/add-site-1']);
      // }
      // else {
      //   alert("Technical Error Occured !!!");
      // }
      

      //alert('Your Form is Submitted');


    }
    else {
      console.log('Form is invalid. Please check the fields.');
      alert('Please fill all values correctly');
      this.submitted=false;
    }
  }


}
