import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-site-1',
  templateUrl: './add-site-1.component.html',
  styleUrl: './add-site-1.component.css'
})
export class AddSite1Component implements OnInit, AfterViewInit {
  isOpen= true;
  mail = '';
  name = '';
  isnull = false;

  constructor(private userService: UsersService, private messageService: MessageService , private router: Router) {}

  ngOnInit(): void {
    const Data = typeof localStorage !== 'undefined' ? localStorage.getItem('RegisteredUser') : null;
    console.log('Data var: ', Data);

    if (Data!== 'undefined' && Data!= null) {
      const parseData = JSON.parse(Data);
      console.log('parseData is: ', parseData);
      this.mail = parseData.mail;
      this.name = parseData.name;
      this.sendmail();
    }
    else {
      this.isnull = true;
    }
  }

  ngAfterViewInit(): void {
      if(this.isnull) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error occured!!', life: 5000 });
      }
  }
  sendmail() {
    const DataSent = {
      mail: this.mail,
      name: this.name
    }
    console.log('Data is: ', DataSent);
    
    
      this.userService.send_signup_confirmation_mail(DataSent).subscribe(
        (response) => {
          console.log('Response: ', response);
          localStorage.removeItem('RegisteredUser');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Confirmation mail send successfully!!', life: 5000  });

        },
        (error) => {
          console.log('Error: ', error);
          localStorage.removeItem('RegisteredUser');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error: '+ error.error.error, life: 5000 });
        }
      )
  }

  close() {
    this.isOpen=!this.isOpen;
  }

  goBack() {
    this.router.navigate(['/sign-up']);
  }
}
