import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {

  email='';
  showPassword1: boolean = true;
  showPassword2: boolean = true;
  showPassword3: boolean = true;
  current_password = '';
  new_password = '';
  repeat_password = '';
  status="";
  //two_factor = false;


  constructor(private userService: UsersService, private route: Router) {}

  ngOnInit(): void {
    const userData = typeof localStorage !== 'undefined' ? localStorage.getItem('userData') : null;

    if (userData) {
      const user = JSON.parse(userData);
      this.status=user.status;
      this.email = user.email_id;
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
            alert('Password Changed Successfully!!!');
            this.route.navigate(['/login']);
            localStorage.clear();
          }, 
          (error) => {
            console.log('Error in changing error', error);
            alert('Error: '+error.error.error);
          }
        )
        this.current_password = '';
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
