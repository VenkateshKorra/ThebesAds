import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { NotificationMessageDialogComponent } from '../notification-message-dialog/notification-message-dialog.component';

interface PublisherNotification {
  id: number;
  sender: number;
  publisher_id: number;
  subject: string;
  message: string;
  isSeen: number;


}

@Component({
  selector: 'app-publisher-notification',
  templateUrl: './publisher-notification.component.html',
  styleUrl: './publisher-notification.component.css'
})
export class PublisherNotificationComponent implements OnInit {

  notification_list_array: any;

  constructor(private userService: UsersService, private messageService: MessageService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.get_notification();
  }


  get_notification() {
    this.userService.get_notification_list().subscribe(
      (response) => {
        this.notification_list_array = response.publisherNotifications;
        // console.log('Notification: ',this.notification_list_array );
        // console.log('1 index value: ', this.notification_list_array[1].Subject);

      },
      (error) => {
        this.userService.logoutUser(error.error.error);
        console.log('Error: ', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in getting notification details', life: 5000  });
      }
    )
  }

  onMessageClick(index: number) {
    const notficatio_id = {
      Notification_Id: this.notification_list_array[index].Id
    }
    this.userService.mark_notification_read(notficatio_id).subscribe(
      (response) => {
        console.log('Message Opened');
        this.get_notification();
      },
      (error) => {
        this.userService.logoutUser(error.error.error);
        console.log('Error: ', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in marking message read', life: 5000  });
      }
    )
    const Data = {
      message: this.notification_list_array[index].Message,
      subject: this.notification_list_array[index].Subject
    }
    console.log('Data is: ', Data);
    
      const rejectdialogRef = this.dialog.open(NotificationMessageDialogComponent, {
        width: '50%',
        data: Data,
      });
  
      rejectdialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.rejectContact(row, result);
          // this.send_reject_email(row, result);
        }
        console.log('The dialog was closed', result);
      });
  }
}
