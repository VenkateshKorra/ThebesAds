import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-notification-dashboard-admin',
  templateUrl: './notification-dashboard-admin.component.html',
  styleUrl: './notification-dashboard-admin.component.css'
})
export class NotificationDashboardAdminComponent implements OnInit {

  selected_publisher_id = '';
  subject ='';
  message ='';
  typeOfUser='';
  account_names: any;

  @Output() closeNotification:EventEmitter<any> = new EventEmitter();


  constructor(private userService: UsersService, private messageService: MessageService) {}
  
ngOnInit(): void {
  this.typeOfUser = this.userService.getType();
  this.getAccountNames();
}


  getAccountNames() {
    const Data = {
      type: this.typeOfUser
    }
    this.userService.getAccountNames(Data).subscribe(
      (response) => {
         const mappedData = response.map((user: any) => ({
            Account_Id: user.Account_Id,
            Account_Name: user['Account_Name'],
            account_id_name : user.Account_Id + '-' + user['Account_Name']
         }));
        // console.log('Sucessful in getting Account Names: ',this.account_names);
  
        this.account_names = mappedData;
      },
      (error) => {
        // alert('Error: '+ error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });
      }
    )
  }

  onSubmit(form: NgForm) {
    console.log('Form is: ', form.valid);
    
    if(form.valid) {
      const Data = {
        Publisher_Id: this.selected_publisher_id,
        Message: this.message,
        Subject: this.subject
      }

      this.userService.create_notification(Data).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Notification created successfully!!', life: 5000 });
        }, 
        (error) => {
          console.log('Error: ', error);
          this.userService.logoutUser(error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error occured: '+error.error.error, life: 5000  });
        }
      )
      this.selected_publisher_id='';
      this.message='';
      this.subject='';

    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 5000  });
    }
  }

  onCancel() {
    // console.log('Inside cancel');
    this.userService.set_notification();
    this.closeNotification.emit();
    // console.log('userservice: ', this.userService.get_notification());
    
    this.selected_publisher_id='';
      this.message='';
      this.subject='';
  }

  

}
