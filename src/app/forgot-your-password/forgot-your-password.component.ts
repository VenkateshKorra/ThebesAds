import { Component } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-your-password',
  templateUrl: './forgot-your-password.component.html',
  styleUrl: './forgot-your-password.component.css'
})
export class ForgotYourPasswordComponent {
  email ='';

  constructor(private userService: UsersService, private messageService: MessageService) {}

  onSubmit(form: NgForm) {
    console.log('Form is: ', form.valid);
    const Data = {
      Email: this.email
    }
    if(form.valid) {
      this.userService.sendResetPassword(Data).subscribe(
        (response)=> {
          console.log('Password Reset Mail is Sent successfully!!!');
          // alert('Password Reset Mail is Sent successfully!!!');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password Reset Mail is Sent successfully!!!', life: 5000  });
          this.email='';
        },
        (error)=> {
          console.log('Error in sending mail for reset!!!');
          // alert('Error: '+ error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });
        }
      )
    }
    else {
      // alert('Form is invalid:');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Form is Invalid', life: 5000  });
    } 
    
  }

}
