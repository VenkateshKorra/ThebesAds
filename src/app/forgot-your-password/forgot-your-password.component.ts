import { Component } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-forgot-your-password',
  templateUrl: './forgot-your-password.component.html',
  styleUrl: './forgot-your-password.component.css'
})
export class ForgotYourPasswordComponent {
  email ='';

  constructor(private userService: UsersService) {}

  onSubmit(form: NgForm) {
    console.log('For is: ', form.valid);
    const Data = {
      Email: this.email
    }
    if(form.valid) {
      this.userService.sendResetPassword(Data).subscribe(
        (response)=> {
          console.log('Password Reset is Sent successfully!!!');
          alert(response.message);
          this.email='';
        },
        (error)=> {
          console.log('Error in sending mail for reset!!!');
          alert('Error: '+ error.error.error);
        }
      )
    }
    else {
      alert('Form is invalid:');
    } 
    
  }

}
