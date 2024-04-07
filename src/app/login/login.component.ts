import { Component, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { UsersService } from '../users.service';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  emailAddress='';
  password='';
  role='';
  res='';

  userName='';
  constructor(private usersService: UsersService, private router: Router) {}

  onSubmit() {
    if(this.emailAddress && this.password) {
      //console.log(this.emailAddress, this.password);
      
      const formData = {
        email_id: this.emailAddress,
        //Type: this.role,
        Password : this.password,
      }
      this.usersService.save_user_details(formData).subscribe(
        (response) => {
          // Success response
          if (response.message === "Login successful" && response.data) {
            // Handle success response
            //console.log('Success:', response.data);
            //console.log('Response type: ', response.data.Type);
            
            if(response.data.Type=='Admin' && response.data.status!=='Disabled') {
              localStorage.setItem('userData', JSON.stringify(response.data));
              localStorage.setItem('userName', 'Admin');
              localStorage.setItem('PublisherID','Publisher ID');
              this.router.navigate(['/admin-dashboard']);
              alert('Success: Logged in as Admin');

              // this.router.navigate(['/admin-dashboard']);
              // alert('Success: Logged in as ' + response.data.email_id);
            }
            else if(response.data.Type=='Publisher' && response.data.status!=='Disabled') {
              localStorage.setItem('userData', JSON.stringify(response.data));
              this.get_user_name(response.data.email_id, response.data.Type);
              // this.router.navigate(['/user-dashboard']);
              //console.log('user-dashboard');
              // alert('Success: Logged in as ' + response.data.email_id);
            }
            else {
              alert('Error logging in !!!');
            }
          } else {
            // Handle unexpected success response
            console.error('Unexpected success response:', response);
            alert('Failure: Invalid credentials. Please try again.');
          }
        },
        (error) => {
          // Error response
          console.error('Error:', error);
          if (error.error === "Invalid credentials") {
            // Handle invalid credentials error
            console.log('Failure: Invalid credentials');
            alert('Failure: Invalid credentials. Please try again.');
          } else {
            // Handle unexpected error response
            console.error('Unexpected error response:', error);
            alert("Technical error Occured !!!");
          }
        }
      );  
    }
    else {
      alert("Please enter Id and password correctly");
    }
    
  }

  get_user_name(email_id: any, type: any) {
    const Data = {
      email: email_id
    };
    this.usersService.get_user_name(Data).subscribe(
      (response) => {
        console.log('Response Data: ', response.data); // Log the entire response object
        // Check if the 'Publisher Name' key exists and has a value
        if (response.data && response.data['Publisher Name'] && response.data['Publisher ID']) {
          this.userName = response.data['Publisher Name'];
          console.log('UserName in login is', this.userName);
          localStorage.setItem('userName', this.userName);
          localStorage.setItem('PublisherID',response.data['Publisher ID']);
          console.log('Publisher ID is : ',response.data['Publisher ID']);
          
          if (type === 'Publisher') {
            this.router.navigate(['/user-dashboard']);
            alert('Success: Logged in as ' + this.userName);
          }
        } else {
          console.log('Publisher Name or ID is not found in the database');
          alert('Publisher Name or ID is not found in the database');
          localStorage.clear();
          // Handle the case where the 'Publisher Name' key is not found
        }
      },
      (error) => {
        console.log('Error getting user name: ', error);
        localStorage.clear();
        console.error("Can't Find user with the given credentials");
        alert("Can't Find user with the given credentials ");
        
      }
    );
  }
  
}
