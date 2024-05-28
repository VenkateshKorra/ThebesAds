import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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



  constructor(private activatedRoute: ActivatedRoute, private userService: UsersService, private route: Router, private messageService: MessageService) {}

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
        this.userService.logoutUser(error.error.error);  
        // alert('Link is not valid !!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Link is not valid', life: 5000  });
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
            // alert('Password Changed Successfully!!!');
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password Changed Successfully!!!', life: 5000  });
            this.route.navigate(['/login']);
            
          }, 
          (error) => {
            console.log('Error in changing password', error);
            this.userService.logoutUser(error.error.error);
            // alert('Error: '+error.error.error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });
          }
        )
        // this.current_password = '';
        this.new_password = '';
        this.repeat_password = '';
        //this.two_factor = false;
      } else {
        // alert('current password and repeat password does not match')
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Current password and repeat password does not match', life: 5000  });
      }
      
    }
    else {
      // alert('Please fill all input fields');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all input fields', life: 5000  });
    }
  }
}
