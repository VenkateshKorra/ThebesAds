import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  
  email='';
  // showPassword1: boolean = true;
  showPassword2: boolean = true;
  showPassword3: boolean = true;
  // current_password = '';
  new_password = '';
  repeat_password = '';
  token="";
  valid= false;



  constructor(private activatedRoute: ActivatedRoute, private userService: UsersService, private route: Router) {}

  ngOnInit(): void {
    // const userData = typeof localStorage !== 'undefined' ? localStorage.getItem('userData') : null;
    this.activatedRoute.params.subscribe(params => {
      this.token = params['name']; // Access 'name' route parameter
      console.log('Token is: ', this.token);
    });  
    const Data= {
      token: this.token
    }
    this.userService.validate_reset_token(Data).subscribe(
      (response)=> {
        console.log('Response from validate token is: ',response );
        this.email=response.email;
        console.log('email is: ', this.email);
        this.valid=true;
      }, 
      (error) => {
        console.log('Error from validate token is : ', error);     
        // alert('Link is not valid !!');
      }
      )
}
  
  onSubmit(form: NgForm) {
    console.log('Form is: ', form.valid);
    
    if (form.valid) {
      if(this.new_password == this.repeat_password) {
        // console.log(this.current_password, this.new_password, this.repeat_password);
        const passwordData = {
          email: this.email,
          // currentPassword :this.current_password, 
          newPassword: this.new_password, 
          token: this.token
          // repeat_pass: this.repeat_password
        }
        this.userService.resetPassword(passwordData).subscribe(
          (response) => {
            console.log('Password Changed successfully', response);
            alert('Password Changed Successfully!!!');
            this.route.navigate(['/login']);
            
          }, 
          (error) => {
            console.log('Error in changing password', error);
            alert('Error: '+error.error.error);
          }
        )
        // this.current_password = '';
        this.new_password = '';
        this.repeat_password = '';
        //this.two_factor = false;
      } else {
        alert('current password and repeat password does not match')
      }
      
    }
    else {
      alert('Please fill all input fields');
    }
  }
}
