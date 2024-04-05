import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserData } from '../contacts/contacts.component';
import { UsersService } from '../users.service';
import { countries } from '../sign-up-dropdown';

@Component({
  selector: 'app-send-invite',
  templateUrl: './send-invite.component.html',
  styleUrl: './send-invite.component.css'
})
export class SendInviteComponent implements OnInit {
  @Input() isOpen = false;
  @Input() selectedRowData: UserData | undefined;;

  @Output() inviteClosed: EventEmitter<any> = new EventEmitter();

  res = '';
  countries_list: any;

  constructor(private usersService: UsersService) { }



   formData = {
    id: '',
    Name: '',
    Country: '',
    Margin: '',
    Phone: '',
    Email: '',
    Mcm_invite: false,
    Code: '',
  };

  contact_status = '';

  ngOnInit(): void {
    this.countries_list= countries;
    this.isOpen = true;
    if (this.selectedRowData) {
      this.formData.id =this.selectedRowData.id!;
      this.formData.Name = this.selectedRowData.name;
      this.formData.Country = this.selectedRowData.country;
      this.formData.Phone = this.selectedRowData.phone;
      this.formData.Email = this.selectedRowData.email;
      this.contact_status = this.selectedRowData.status;
      console.log('id is: ',this.formData.id);

      // Assign other properties as needed
    }
  }

  openModal() {
    this.isOpen = true;
  }

  onClose() {
    this.isOpen = false;
  }

  onSubmit() {
    // Handle form submission logic here
    //console.log('Invite data sent: ', this.formData);
    if (!this.contact_status) {
      this.contact_status = 'Approval Required';
    }
    
    //console.log(accountData);
    // this.createUsers(accountData.Email);

    if (this.formData.Name && this.formData.Country && this.formData.Margin && this.formData.Email && this.formData.Phone) {
      this.usersService.createCompanies(this.formData).subscribe(
        (response) => {
          console.log('Response of create Companies :', response);
          this.res = 'ok';
          const accountData = {
            id: this.formData.id,
            publisher_id: response[0].id,
            publisher_name: response[0].name,
            Status: 'Invitation Sent',
            MCM_status: 'Invited',
            Country: this.formData.Country,
            Margin: this.formData.Margin,
            Email: this.formData.Email,
            Phone: this.formData.Phone,
            Sites: 0,
            Apps: 0,
          }
          alert('Account is Created Successfully!!!');
          this.updateAccount(accountData);
          const inviteStatus = "submit" + " " + this.res;
          this.inviteClosed.emit('ok');
          console.log('inviteStatus: ', inviteStatus);
          this.createUsers(accountData.Email);
          

        },
        (error) => {
          console.log('Error occured in create companies : ', error);
          this.res = 'no';
          this.inviteClosed.emit('no');
          alert('Technical error occured while sendig Invite!!!');

        }
      );
  
      this.isOpen = false; // Close the modal after form submission
      // this.formData = {
      //   id:'',
      //   Name: '',
      //   Country: '',
      //   Margin: '',
      //   Phone: '',
      //   Email: '',
      //   Mcm_invite: false,
      //   Code: '',
      // };
    }
    else {
      alert('Please fill all data correctly!!');
    }

  }

  // display() {
  //   this.isOpen = !this.isOpen;
  //   this.inviteClosed.emit();
  // }

  onCancel() {
    //console.log('cancelled');
    this.isOpen = false;
    this.inviteClosed.emit("cancel");
  }


  updateAccount(account_Data: any) {
    console.log('Account Data is: ', account_Data);
    
    this.usersService.save_admin_account_list(account_Data).subscribe(
      (response) => {
        console.log('Response from admin_account_list: ', response);
      },
      (error) => {
        console.log('Error from admin_account_list: ', error);

      }
    )
  }

  createUsers(email: any) {
    const emailRequired = {
      Email: this.formData.Email,
    }
    console.log('Sending email to create user: ', emailRequired.Email);
    this.usersService.createUser(emailRequired).subscribe(
      (response: any) => {
        console.log('login sent', response);
        alert('Login details is created and sent to mail');
        this.formData = {
          id:'',
          Name: '',
          Country: '',
          Margin: '',
          Phone: '',
          Email: '',
          Mcm_invite: false,
          Code: '',
        };
      }, 
      (error) => {
        console.log('Error creating login', error);
        alert('Error occured while creating user login');
      }
    )
  }

}
