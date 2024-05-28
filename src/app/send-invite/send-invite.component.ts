import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserData } from '../contacts/contacts.component';
import { UsersService } from '../users.service';
import { countries } from '../sign-up-dropdown';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-send-invite',
  templateUrl: './send-invite.component.html',
  styleUrl: './send-invite.component.css'
})
export class SendInviteComponent implements OnInit, AfterViewInit {
  @Input() isOpen = false;
  @Input() selectedRowData: UserData | undefined;;

  @Output() inviteClosed: EventEmitter<any> = new EventEmitter();

  res = '';
  countries_list: any;
  adminName: any;
  created_by = '';

  emailTextLength = false;
  phoneTextLength = false;
  nameTextLength = false;

  constructor(private usersService: UsersService, private messageService: MessageService) { }

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
    this.countries_list = countries;
    this.isOpen = true;
    if (this.selectedRowData) {
      this.formData.id = this.selectedRowData.id!;
      this.formData.Name = this.selectedRowData.name;
      this.formData.Country = this.selectedRowData.country;
      this.formData.Phone = this.selectedRowData.phone;
      this.formData.Email = this.selectedRowData.email;
      this.contact_status = this.selectedRowData.status;
      // console.log('id is: ',this.formData.id);
    }
  }

  ngAfterViewInit(): void {
    if (this.usersService.getType() == 'Admin') {
      const receivedUserData = localStorage.getItem('userData');
      if (receivedUserData) {
        const userDataObject = JSON.parse(receivedUserData);
        this.adminName = userDataObject['User_Name'];
        console.log('Received User Name is: ', this.adminName);
      }
    }
    else {
      this.created_by = this.usersService.getName();
      console.log('Received user name is: ', this.created_by);

    }
  }

  checkNameTextLength() {
    if (this.formData.Name.length > 500) {
      this.nameTextLength = true;
    }
    else {
      this.nameTextLength = false;
    }
  }

  checkEmailTextLength() {
    if (this.formData.Email.length > 100) {
      this.emailTextLength = true;
    }
    else {
      this.emailTextLength = false;
    }
  }

  checkPhoneTextLength() {
    if (this.formData.Phone.length > 20) {
      this.phoneTextLength = true;
    }
    else {
      this.phoneTextLength = false;
    }
  }


  openModal() {
    this.isOpen = true;
  }

  onClose() {
    this.isOpen = false;
  }

  onSubmit() {

    if (this.nameTextLength || this.emailTextLength || this.phoneTextLength) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter valid input sizes', life: 5000 });
    }

    else {
      if (!this.contact_status) {
        this.contact_status = 'Approval Required';
      }

      if (this.formData.Name && this.formData.Country && this.formData.Margin && this.formData.Email && this.formData.Phone) {
        this.usersService.createCompanies(this.formData).subscribe(
          (response) => {
            console.log('Response of create Companies :', response);
            this.res = 'ok';
            const accountData = {
              id: this.formData.id,
              publisher_id: response[0].id,
              publisher_name: response[0].name,
              network_id: response[0].networkCode,
              Status: 'Invitation Sent',
              MCM_status: 'Invited',
              Country: this.formData.Country,
              Margin: this.formData.Margin,
              Email: this.formData.Email,
              Phone: this.formData.Phone,
              Sites: 0,
              Apps: 0,
              created_by: this.adminName
            }
            // alert('Account is Created Successfully!!!');

            this.updateAccount(accountData);
            const inviteStatus = "submit" + " " + this.res;
            // this.inviteClosed.emit('ok');
            console.log('inviteStatus: ', inviteStatus);
            this.createUsers(accountData.Email, this.formData.Name);


          },
          (error) => {
            console.log('Error occured in create companies : ', error);
            this.res = 'no';
            this.usersService.logoutUser(error.error.error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error occured!!! ' + error.error.error, life: 5000 });
            this.inviteClosed.emit('no');
            // alert('Technical error occured while sendig Invite!!!');


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
        // alert('Please fill all data correctly!!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all data correctly', life: 5000 });

      }
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
        this.usersService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Occured!!!' + error.error.error, life: 5000 });

      }
    )
  }

  createUsers(email: any, Name: any) {
    const emailRequired = {
      Email: this.formData.Email,
      user_name: Name
    }
    console.log('Sending email to create user: ', emailRequired.Email);
    this.usersService.createUser(emailRequired).subscribe(
      (response: any) => {
        console.log('login sent', response);
        this.inviteClosed.emit('ok');
        // alert('Login details is created and sent to mail');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login detail sent to email', life: 5000 });
        this.formData = {
          id: '',
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
        this.usersService.logoutUser(error.error.error);
        // alert('Error occured while creating user login');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Occured!!!' + error.error, life: 5000 });
      }
    )
  }

}
