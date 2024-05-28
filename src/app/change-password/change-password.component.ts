import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {

  email='';
  publisher_id: any;
  percent: any;
  showPassword1: boolean = true;
  showPassword2: boolean = true;
  showPassword3: boolean = true;
  current_password = '';
  new_password = '';
  repeat_password = '';
  status="";
  //two_factor = false;


  constructor(private userService: UsersService, private route: Router, private messageService: MessageService) {}

  ngOnInit(): void {
    const userData = typeof localStorage !=undefined ? localStorage.getItem('userData'): null;
    const userName = typeof localStorage !=undefined ? localStorage.getItem('userName'): null;
    const publisherId = typeof localStorage != undefined ? localStorage.getItem('PublisherID'): null;
    const userAllData = typeof localStorage != undefined ? localStorage.getItem('UserInfo'): null;
    if(userData && userName) {
      const user =JSON.parse(userData);
      this.email= user.Email_Id;
      // this.name=userName;
      this.status=user.Status;
      this.publisher_id = publisherId;
      // console.log('name and mail is', this.email, this.name);
      
    }
    if(this.userService.getType() !='Admin' && userAllData) {
      const userInfo = JSON.parse(userAllData);
      this.percent = userInfo.Margin;
    }
}
  
  onSubmit(form: NgForm) {
    console.log('Form is: ', form.valid);
    
    if (form.valid) {
      if(this.new_password == this.repeat_password) {
        // console.log(this.current_password, this.new_password, this.repeat_password);
        const passwordData = {
          email: this.email,
          currentPassword :this.current_password, 
          newPassword: this.new_password, 
          // repeat_pass: this.repeat_password
        }
        this.userService.changePassword(passwordData).subscribe(
          (response) => {
            console.log('Password Changed successfully', response);
            // alert('Password Changed Successfully!!!');
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password Changed Successfully', life: 5000  });
            localStorage.clear();
            setTimeout(()=> {
              this.route.navigate(['/login']);
            }, 1000);
            
            
          }, 
          (error) => {
            console.log('Error in changing error', error);
            this.userService.logoutUser(error.error.error);
            // alert('Error: '+error.error.error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in changing password', life: 5000  });
          }
        )
        this.current_password = '';
        this.new_password = '';
        this.repeat_password = '';
        //this.two_factor = false;
      } else {
        // alert('current password and repeat password does not match')
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'current password and repeat password does not match', life: 5000  });
      }
      
    }
    else {
      // alert('Please fill all input fields');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all input fields', life: 5000  });
    }
  }
}
