import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import the isPlatformBrowser function
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../users.service';


export interface UserData {
  id?: number;
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

  updateChanged = {}



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UsersService, @Inject(PLATFORM_ID) private platformId: Object) {
    // Initialize MatTableDataSource with an empty array
    this.dataSource = new MatTableDataSource<UserData>([]);

  }

  ngOnInit(): void {
    // Fetch and display contacts when component initializes
    if (isPlatformBrowser(this.platformId)) {
      this.show_user_details();
    }
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
    element.showOptions = !element.showOptions;
  }

  show_user_details() {
    this.userService.get_user_login_details().subscribe(
      (response: any[]) => {
        const mappedUsers: UserData[] = response.map((user, index) => ({
          id: index + 1 ,
          email: user.email_id,
          type: user.Type,
          password: user.Password,
          status: user.status, // Assuming there's a property named "Status" in the fetched data
          attempts: user.failed_login_attempts,
          showOptions: false
        }));
        this.dataSource.data = mappedUsers;
        console.log('Response of user_details', response);
        
      },
      (error) => {
        console.log("Error in retrieving Data!!!", error);
        
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
          alert('Enabled successfully!!!');
          this.show_user_details();
          // this.updateDisableStatus(statusUpdate.status, statusUpdate.id);
        }
        if(response.message== "No rows updated") {
          alert("No records found with this email,  enable is unsuccessfully!!");
        } 
      }, 
      (error) => {
        console.log('Error enabling ', error);
        alert('Error Enabling option!!');
        
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
          alert('Disabled successfully!!!');
          this.show_user_details();
          // this.updateDisableStatus(statusUpdate.status, statusUpdate.id);
        }
        if(response.message== "No rows updated") {
          alert("No records found with this email,  disable is unsuccessfully!!");
        } 
      }, 
      (error) => {
        console.log('Error disabling ', error);
        alert('Error disabling option!!');
        
      }
    )
  }

}
