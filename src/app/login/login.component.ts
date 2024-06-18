import { Component, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { UsersService } from '../users.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  emailAddress='';
  password='';
  role='';
  res= ''; 
  userName='';

  storeAssignedPublishers=[];

  constructor(private usersService: UsersService, private router: Router, private messageService: MessageService) {}

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
          if(response.token) {
            localStorage.setItem('token', response.token);
          }
          // Success response
          if (response.message === "Login successful" && response.data) {
            // Handle success response
            // console.log('Success:', response.data);
            //console.log('Response type: ', response.data.Type);

            
            if(response.data.Type=='Admin' && response.data.Status!=='Disabled') {
              localStorage.setItem('userData', JSON.stringify(response.data));
              localStorage.setItem('userName', 'Admin');
              localStorage.setItem('PublisherID','Publisher ID');
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged in Successfully', life: 5000});
              setTimeout(() => {
                this.router.navigate(['/admin-dashboard']);
              }, 1000);
              // alert('Success: Logged in as Admin');
              
            

              // this.router.navigate(['/admin-dashboard']);
              // alert('Success: Logged in as ' + response.data.email_id);
            }
            else if(response.data.Type=='AdOpsManager' && response.data.Status!=='Disabled') {
              this.role= 'AdOpsManager';
              localStorage.setItem('userData', JSON.stringify(response.data));
              localStorage.setItem('userName', 'AdOpsManager');
              localStorage.setItem('PublisherID','Publisher ID');
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged in Successfully', life: 5000});
              setTimeout(() => {
                this.router.navigate(['/admin-dashboard']);
              }, 1000);

              // this.getAssignedPublishers(response.data.Email_Id);
              
            }

            else if(response.data.Type=='Distributor' && response.data.Status!=='Disabled') {
              this.role= 'Distributor';
              localStorage.setItem('userData', JSON.stringify(response.data));
              localStorage.setItem('userName', 'Distributor');
              localStorage.setItem('PublisherID','Publisher ID');
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged in Successfully', life: 5000});
              setTimeout(() => {
                this.router.navigate(['/admin-dashboard']);
              }, 1000);
              // this.getAssignedPublishers(response.data.Email_Id);
              
            }


            else if(response.data.Type=='Publisher' && response.data.Status!=='Disabled') {
              localStorage.setItem('userData', JSON.stringify(response.data));
              this.get_user_name(response.data.Email_Id, response.data.Type);
              console.log('response.data.email_id');
              
              // this.router.navigate(['/user-dashboard']);
              //console.log('user-dashboard');
              // alert('Success: Logged in as ' + response.data.email_id);
            }
            // else if(response.data.Status=='Disabled') {
            //   // alert('Error logging in !!!');
            //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Account is Disabled !!!', life: 5000  });
            // }

            else {
              // alert('Error logging in !!!');
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Account is Disabled !!!', life: 5000  });
            }
          } else {
            // Handle unexpected success response
            // console.error('Unexpected success response:', response);
            // alert('Failure: Invalid credentials. Please try again.');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failure: Invalid credentials. Please try again.', life: 5000 });
          }
        },
        (error) => {
          console.error('Error:', error);
          
          if (error.error === "Invalid credentials") {
            // Handle invalid credentials error
            console.log('Failure: Invalid credentials');
            // alert('Failure: Invalid credentials. Please try again.');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failure: Invalid credentials. Please try again.', life: 5000 });
          } else {
            // console.error('Unexpected error response:', error);
            // alert("Technical error Occured !!!");
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Technical Error occured!!', life: 5000 });
          }
        }
      );  
    }
    else {
      // alert("Please enter Id and password correctly");
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter User Id and password correctly', life: 5000 });
    }
    
  }

  get_user_name(email_id: any, type: any) {
    const Data = {
      email: email_id
    };
    this.usersService.get_user_name(Data).subscribe(
      (response) => {
        // console.log('Response Data: ', response.data); 
        // Check if the 'Publisher Name' key exists and has a value
        if (response.data && response.data['Account_Name'] && response.data['Account_Id']) {
          this.userName = response.data['Account_Name'];
          console.log('UserName in login is', this.userName);
          localStorage.setItem('userName', this.userName);
          localStorage.setItem('PublisherID',response.data['Account_Id']);
          localStorage.setItem('UserInfo', JSON.stringify(response.data));
          // console.log('Publisher ID is : ',response);
          if (type === 'Publisher') {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged in successfully', life: 5000 });
            setTimeout(()=> {
              this.router.navigate(['/user-dashboard']);
            }, 1000);
            
            // alert('Success: Logged in as ' + this.userName);
            
          }
        } else {
          console.log('Publisher Name or ID is not found in the database');
          // alert('Publisher Name or ID is not found in the database');
          localStorage.clear();
          // Handle the case where the 'Publisher Name' key is not found
        }
      },
      (error) => {
        console.log('Error getting user name: ', error);
        localStorage.clear();
        console.error("Can't Find user with the given credentials");
        // alert("Can't Find user with the given credentials ");
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Can't Find user with the given credentials ", life: 5000 });
        
      }
    );
  }

  // getAssignedPublishers(email: string) {
  //   const Data = {
  //     Email: email
  //   }
  //   this.usersService.accessAssignedPublishers(Data).subscribe(
  //     (response) => {
  //       this.storeAssignedPublishers= response.publishers;
  //       localStorage.setItem('AssignedPublishers', JSON.stringify(this.storeAssignedPublishers));
  //       console.log('Asssigned publishers are: ', this.storeAssignedPublishers);
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logged in Successfully', life: 5000});
  //             setTimeout(() => {
  //               if(this.role=='Distributor') {
  //                 this.router.navigate(['/user-dashboard']);
  //               }
  //               else {
  //                 this.router.navigate(['/admin-dashboard']);
  //               }
                
  //             }, 1000);
        
  //     }, 
  //     (error) => {
  //       console.log('Error: ', error);
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: "Can't Find user with the given credentials ", life: 5000 });
  //     }
  //   )
  // }
  
}
