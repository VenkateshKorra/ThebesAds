import { AfterViewInit, Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import the isPlatformBrowser function
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';
import { userTypedropdown } from '../sign-up-dropdown';
import { FormControl, NgForm } from '@angular/forms';



export interface UserData {
  id?: number;
  name: string;
  email: string;
  type: string;
  // password: string;
  status: string;
  attempts: number;
  assignedPublishers: string;
  managerMargin: any;
  showOptions: boolean;
}

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements AfterViewInit, OnInit {


  selectedRowData: UserData | undefined;
  inviteSend = false;
  click = false;
  count = 1;
  displayedColumns: string[] = ['id', 'email', 'type','status', 'attempts', 'action'];
  dataSource: MatTableDataSource<UserData>;

  userTypeOptions : any;

  updateChanged = {}
  typeOfUser='';

  userName = '';
  userEmail = '';
  userType = '';
  userPassword = '';
  // assign_publisher_string='';
  assign_margin = 0;
  assign_publisher_list:number[] = [];

  edit_id: any;
  edit_userName = '';
  edit_userEmail = '';
  edit_userType = '';
  edit_userPassword = '';
  // edit_assigned_publisher_string='';
  account_names: any;
  edit_assigned_margin = '';
  // edit_assigned_publisher_list: number[]=[];

  editClicked = false;

  Publishers = new FormControl('');
  edit_Publishers = new FormControl('');


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UsersService, @Inject(PLATFORM_ID) private platformId: Object, private messageService: MessageService) {
    // Initialize MatTableDataSource with an empty array
    this.dataSource = new MatTableDataSource<UserData>([]);

  }

  ngOnInit(): void {
    // Fetch and display contacts when component initializes
    this.typeOfUser = this.userService.getType();
    this.userTypeOptions = userTypedropdown;
    this.getAccountNames();
    this.show_user_details();

  }

  ngAfterViewInit() {
    // Assign paginator and sort to the data source after view initialization
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(event: Event) {
    // Apply filter based on user input
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Go to the first page of paginator
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  performAction(element: UserData) {
    //console.log("Button value is ", element);
    //alert('Action button is clicked');
    this.dataSource.data.forEach((item: any) => {
      if(item !== element) {
        item.showOptions = false;
      }
    })
    element.showOptions = !element.showOptions;
    // console.log(element.showOptions);
  }

  show_user_details() {
    this.userService.get_user_login_details().subscribe(
      (response) => {
        const mappedUsers: UserData[] = response.data.map((user: any, index: any) => ({
          id: user.Id,
          name: user.User_Name,
          email: user.Email_Id,
          type: user.Type,
          // password: user.Password,
          assignedPublishers: user.assignedPublishers,
          status: user.Status, // Assuming there's a property named "Status" in the fetched data
          attempts: user.Failed_Login_Attempts,
          managerMargin: user.ManagerMargin,
          showOptions: false
        }));
        this.dataSource.data = mappedUsers;
        // console.log('Response of user_details', response);
        
      },
      (error) => {
        console.log("Error in retrieving Data!!!", error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error !!!', life: 5000  });
        
      }
    )
  }
  enable(element: any) {
    if(element.status=='Active') {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account already Active', life: 5000  });
    }
    else {
    const enable = {
      Id: element.id, 
      Status: 'Active'
    }

    this.userService.disableOption(enable).subscribe(
      (response) => {
        console.log('Enabled successfully!!!', response);
          // alert('Enabled successfully!!!');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Enabled successfull', life: 5000  });
          this.show_user_details();
          // this.updateDisableStatus(statusUpdate.status, statusUpdate.id);
      }, 
      (error) => {
        console.log('Error enabling ', error);
        this.userService.logoutUser(error.error.error);
        // alert('Error Enabling option!!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Enabling option!!!', life: 5000  });
        
      }
    )
  }
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

  disable(element: any) {
    if(element.status=='Disabled') {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account is already Disabled', life: 5000  });
    }
    else {
    const disabled = {
      Id: element.id, 
      Status: 'Disabled'
    }

    this.userService.disableOption(disabled).subscribe(
      (response) => {
        console.log('Disabled successfully!!!', response);
        
          // alert('Disabled successfully!!!');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Disabled Successfully', life: 5000  });
          this.show_user_details();
          // this.updateDisableStatus(statusUpdate.status, statusUpdate.id);

      }, 
      (error) => {
        console.log('Error disabling ', error);
        this.userService.logoutUser(error.error.error);
        // alert('Error disabling option!!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Disabling option !!!', life: 5000  });
        
      }
    )
  }
  }

  editUser(element: any) {
    if(element.type !== 'Admin')  {
          this.editClicked = true;
          console.log('Edit User clicked');
          this.edit_id = element.id;
          this.edit_userName = element.name;
          this.edit_userEmail = element.email;
          this.edit_userType = element.type;
          this.edit_assigned_margin = element.managerMargin;
          // this.edit_assigned_publisher_string = element.assignedPublishers.join(',');
          this.edit_Publishers.setValue(element.assignedPublishers);
          // this.edit_userPassword = element.password
          // console.log('fetched assigned: ', this.edit_Publishers.value);
          // console.log('log: ', element);
          
          // console.log('Margin assigned: ',this.edit_assigned_margin);
          // console.log('Got margin: ', element.ManagerMargin);
          
          
          
          // console.log('edit assigned string: ', this.edit_assigned_publisher_string);
          
    }
    
  }

  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    // console.log('Clicked element is: ', clickedElement);
    this.dataSource.data.forEach((element: UserData) => {
        // Check if the clicked element is outside the action button or dropdown for the current element
        if (!this.isActionButtonOrDropdown(clickedElement, element)) {
            // Hide the dropdown by setting showOptions to false
            element.showOptions = false;
        }
    });
    // Perform change detection if necessary
    this.dataSource.data = [...this.dataSource.data];
}

  isActionButtonOrDropdown(clickedElement: HTMLElement, element: UserData): boolean {
    // Define an array of selectors to check against
    const selectors = ['.image-button', '.action-image'];
  
    // Traverse up the DOM tree from the clicked element
    let currentElement: HTMLElement | null = clickedElement;
  
    while (currentElement !== null) {
        // Check if the current element matches any of the selectors
        for (const selector of selectors) {
            if (currentElement.matches(selector)) {
                return true;
            }
        }
        // Move up to the parent element
        currentElement = currentElement.parentElement;
    }
    return false;
  }

  createUser() {
    this.click = true;
  }

  onSubmit(form: NgForm) {
    this.click = false;
    
    if(form.valid) {
      // if(this.assign_publisher_string) {
      //   this.assign_publisher_list = this.assign_publisher_string.split(',').map(Number);
      // }
      const DataPayload = {
        User_Name: this.userName,
        Email: this.userEmail,
        Type: this.userType,
        Password: this.userPassword,
        PublisherAccountIds: this.Publishers.value,
        Margin: this.assign_margin
      }
      // console.log('DataPayload is: ', DataPayload);
      this.userService.addUserCredentials(DataPayload).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Added Successfully!!', life: 5000  });
          this.show_user_details();
        }, 
        (error) => {
          console.log('Error: ', error);
          this.userService.logoutUser(error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding user !!!'+error.error.message, life: 5000  });
        }
      )
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all fields correctly', life: 5000 });
    }
    this.userName='';
    this.userEmail='';
    this.userType='';
    this.userPassword='';
    this.Publishers.setValue('');
    // this.assign_publisher_string='';
    this.assign_margin=0;
    // this.assign_publisher_list=[];
  }

  onCancelAdd() {
    this.click = false;
    this.userName='';
    this.userEmail='';
    this.userType='';
    this.userPassword='';
    this.Publishers.setValue('');
    // this.assign_publisher_string='';
    this.assign_margin=0;
    // this.assign_publisher_list=[];
  }

  onCancelEdit() {
    this.editClicked = false;
  }

  onSubmitEdit(form: NgForm) {
    this.editClicked = false;
    // this.edit_assigned_publisher_list=[];
    // console.log('assigend publishers in submit: ',this.edit_assigned_publisher_string );
    

    // if(this.edit_assigned_publisher_string) {
    //   this.edit_assigned_publisher_list = this.edit_assigned_publisher_string.split(',').map(Number);
    // }
    const DataEdit = {
      Id: this.edit_id,
      User_Name : this.edit_userName,
      Email: this.edit_userEmail,
      Type : this.edit_userType,
      Password: this.edit_userPassword,
      Margin: this.edit_assigned_margin, 
      PublisherAccountIds: this.edit_Publishers.value

    }

    // console.log('Edit payload is: ', DataEdit);
    if(form.valid) {
      this.userService.userCredentialsEdit(DataEdit).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Changes Updated Successfully!!', life: 5000  });
          this.show_user_details();

        }, 
        (error) => {
          console.log('Error: ', error);
          this.userService.logoutUser(error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in saving changes'+ error, life: 5000 });
        }
      )

      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all fields correctly', life: 5000 });
    }
  }
  

}
