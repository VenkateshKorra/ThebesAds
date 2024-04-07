import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import the isPlatformBrowser function
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../users.service';

export interface UserData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  invite: string;
  invited: string;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements AfterViewInit, OnInit {

  selectedRowData: UserData | undefined;
  inviteSend=false;
  click=false;
  count = 1;
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'country', 'status', 'invited', 'invite'];
  dataSource: MatTableDataSource<UserData>;

  updateChanged = {}

  formData = {
    name: '',
    country: '',
    margin: '',
    phone: '',
    email: '',
    toggleButton: false,
    code: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UsersService,  @Inject(PLATFORM_ID) private platformId: Object) {
    // Initialize MatTableDataSource with an empty array
    this.dataSource = new MatTableDataSource<UserData>([]);
    
  }

  ngOnInit(): void {
    // Fetch and display contacts when component initializes
    if (isPlatformBrowser(this.platformId)) {
    this.show_contacts();
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

  // addUser() {
  //   // Increment count for ID generation
  //   this.count++;

  //   // Create a new user object
  //   const userData: UserData = {
     
  //     name: 'venky',
  //     email: 'venkatchowhaan@gmail.com',
  //     phone: '+91 1234567890',
  //     country: 'India',
  //     status: 'Approval Required',
  //     invite: 'Invite', 
  //     invited: 'N',
  //   };

  //   this.userService.saveUser(userData).subscribe(
  //     (response) => {
  //       console.log('Saved New Contacts', response);

  //     }, 
  //     (error) => {
  //       console.log('Error in saving New Contact', error);
        
  //     }
  //   )
    

  //   // Push the new user to the data source
  //   this.dataSource.data.push(userData);

  //   // Update the change subscription
  //   this.dataSource._updateChangeSubscription();
  // }

  show_contacts() {
    this.userService.getContacts().subscribe(
      (response: any[]) => {
        const mappedUsers: UserData[] = response.map(user => ({
          id: user.id,
          name: user.Name,
          email: user.Email_Id,
          phone: user.Phone_No,
          country: user.Country,
          status: user.status, // Assuming there's a property named "Status" in the fetched data
          invited: user.invited,
          invite: 'Invite' // Assuming there's a property named "Invite" in the fetched data
        }));
  
        this.dataSource.data = mappedUsers;
        //console.log('users data', this.dataSource.data);
        //console.log('Response data', response);
        console.log('Got response successfully', response);
        
      },
      (error) => {
        console.log('Error Fetching users:', error);
      }
    );
  }

  clicked(row: UserData) {

    this.selectedRowData = row;
    this.click= true;
    const updateData= {
      id: row.id,
      invited: 'Y',
      status: 'Invitation Sent',
    }
    this.updateChanged=updateData;
    //console.log('updateChanged is :',this.updateChanged);
    //this.inviteSend = true;
    //console.log('clicked : ',this.click);
  }

  onInviteClosed(event: any) {
    this.click= false;
    //console.log('Invite is closed', this.click);
    //console.log("event is ", event);
    console.log('The res is: ', event);
    
    // Check if the first element of the array is 'submit'
    
    if (event==='ok') {
      this.onUpdate(this.updateChanged);
    }
    
  }

  onUpdate(updateData: any) {
    //console.log("updateData : ", updateData);
    this.userService.updateContacts(updateData).subscribe(
      (response) => {
        console.log("Successfully updated", response);
        alert("Invited column updated!!");
  
        // Update the dataSource to reflect the changes
        const updatedUserIndex = this.dataSource.data.findIndex(user => user.id === updateData.id);
        if (updatedUserIndex !== -1) {
          this.dataSource.data[updatedUserIndex].status = 'Invitation Sent';
          this.dataSource.data[updatedUserIndex].invited = 'Y';
          this.dataSource._updateChangeSubscription();
        }
      },
      (error) => {
        console.log("Error in Saving", error);
      }
    );
  }
  
  
}
