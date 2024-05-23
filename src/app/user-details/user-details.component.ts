import { AfterViewInit, Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import the isPlatformBrowser function
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';
import { userTypedropdown } from '../sign-up-dropdown';
import { NgForm } from '@angular/forms';



export interface UserData {
  id?: number;
  name: string;
  email: string;
  type: string;
  password: string;
  status: string;
  attempts: number;
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
  displayedColumns: string[] = ['id', 'email', 'type', 'password', 'status', 'attempts', 'action'];
  dataSource: MatTableDataSource<UserData>;

  userTypeOptions : any;

  updateChanged = {}

  userName = '';
  userEmail = '';
  userType = '';
  userPassword = '';

  edit_userName = '';
  edit_userEmail = '';
  edit_userType = '';
  edit_userPassword = '';

  editClicked = false;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UsersService, @Inject(PLATFORM_ID) private platformId: Object, private messageService: MessageService) {
    // Initialize MatTableDataSource with an empty array
    this.dataSource = new MatTableDataSource<UserData>([]);

  }

  ngOnInit(): void {
    // Fetch and display contacts when component initializes
    this.userTypeOptions = userTypedropdown;
    // if (isPlatformBrowser(this.platformId)) {
      this.show_user_details();
    // }
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
      (response: any[]) => {
        const mappedUsers: UserData[] = response.map((user, index) => ({
          id: index + 1 ,
          name: user.User_Name,
          email: user.Email_Id,
          type: user.Type,
          password: user.Password,
          status: user.Status, // Assuming there's a property named "Status" in the fetched data
          attempts: user.Failed_Login_Attempts,
          showOptions: false
        }));
        this.dataSource.data = mappedUsers;
        // console.log('Response of user_details', response);
        
      },
      (error) => {
        console.log("Error in retrieving Data!!!", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error !!!', life: 5000  });
        
      }
    )
  }
  enable(element: any) {
    const enable = {
      email: element.email, 
      status: 'Active'
    }

    this.userService.disableOption(enable).subscribe(
      (response) => {
        console.log('Enabled successfully!!!', response);
        if(response.message=="Status updated successfully") {
          // alert('Enabled successfully!!!');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Enabled successfull', life: 5000  });
          this.show_user_details();
          // this.updateDisableStatus(statusUpdate.status, statusUpdate.id);
        }
        if(response.message== "No rows updated") {
          // alert("No records found with this email,  enable is unsuccessfully!!");
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error !!!', life: 5000  });
        } 
      }, 
      (error) => {
        console.log('Error enabling ', error);
        // alert('Error Enabling option!!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Enabling option!!!', life: 5000  });
        
      }
    )
  }

  disable(element: any) {
    const disabled = {
      email: element.email, 
      status: 'Disabled'
    }

    this.userService.disableOption(disabled).subscribe(
      (response) => {
        console.log('Disabled successfully!!!', response);
        if(response.message=="Status updated successfully") {
          // alert('Disabled successfully!!!');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Disabled Successfully', life: 5000  });
          this.show_user_details();
          // this.updateDisableStatus(statusUpdate.status, statusUpdate.id);
        }
        if(response.message== "No rows updated") {
          // alert("No records found with this email,  disable is unsuccessfully!!");
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error !!!', life: 5000  });
        } 
      }, 
      (error) => {
        console.log('Error disabling ', error);
        // alert('Error disabling option!!');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Disabling option !!!', life: 5000  });
        
      }
    )
  }

  editUser(element: UserData) {
    if(element.type !== 'Admin')  {
          this.editClicked = true;
          console.log('Edit User clicked');
          this.edit_userName = element.name;
          this.edit_userEmail = element.email;
          this.edit_userType = element.type;
          this.edit_userPassword = element.password
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
      const DataPayload = {
        name: this.userName,
        email: this.userEmail,
        type: this.userType,
        password: this.userPassword
      }
      console.log('DataPayload is: ', DataPayload);
      this.userService.addUserCredentials(DataPayload).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Added Successfully!!', life: 5000  });
        }, 
        (error) => {
          console.log('Error: ', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding user !!!', life: 5000  });
        }
      )
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all fields correctly', life: 5000 });
      
    }
  }

  onCancelAdd() {
    this.click = false;
  }

  onCancelEdit() {
    this.editClicked = false;
  }

  onSubmitEdit(form: NgForm) {
    this.editClicked = false;
    const DataEdit = {
      name : this.edit_userName,
      email: this.edit_userEmail,
      type : this.edit_userType,
      password: this.edit_userPassword
    }

    console.log('Edit payload is: ', DataEdit);
    if(form.valid) {
      this.userService.userCredentialsEdit(DataEdit).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Changes Updated Successfully!!', life: 5000  });
          this.show_user_details();

        }, 
        (error) => {
          console.log('Error: ', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in saving changes'+ error, life: 5000 });
        }
      )

      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all fields correctly', life: 5000 });
    }
  }
  

}
