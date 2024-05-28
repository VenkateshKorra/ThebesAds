import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import the isPlatformBrowser function
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';  

export interface UserData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  invite: string;
  invited: string;
  created_on: string;
  invited_on: string;
  created_by: string;
  app_mediation_platform: string;
  est_daily_user: string;
  product_type: string;
  url: string;
  web_monthly_page_view: string;
  top_country: string;
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
  displayedColumns: string[] = [ 'name', 'email', 'phone', 'country', 'status', 'invited', 'invite', 'created_on', 'invited_on', 'created_by'];
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

  constructor(private userService: UsersService,  @Inject(PLATFORM_ID) private platformId: Object, private router: Router, private messageService: MessageService, public dialog: MatDialog) {
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

  addUser()  {
    console.log('Add User Clicked');
    this.router.navigate(['/sign-up']);
  }

  show_contacts() {
    this.userService.getContacts().subscribe(
      (response: any[]) => {
        const mappedUsers: UserData[] = response.map(user => ({
          id: user.Id,
          name: user.Name,
          email: user.Email_Id,
          phone: user.Phone_No,
          country: user.Country,
          status: user.Status, // Assuming there's a property named "Status" in the fetched data
          invited: user.Invited,
          invited_on: user.Invited_On,
          created_on: user.Created_On,
          created_by: user.Created_By,
          invite: 'Invite', // Assuming there's a property named "Invite" in the fetched data
          app_mediation_platform: user.App_Mediation_Platform,
          est_daily_user: user.Est_Daily_User,
          product_type: user.Product_Type,
          url: user.URL,
          web_monthly_page_view: user.Web_Monthly_Page_View,
          top_country: user.Top_Country
        }));
  
        this.dataSource.data = mappedUsers;
        //console.log('users data', this.dataSource.data);
        //console.log('Response data', response);
        // console.log('Got response successfully', response);
        
      },
      (error) => {
        console.log('Error Fetching users:', error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });
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

  openDialog(element: any) {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '70%',
      data: element, // Pass row data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onUpdate(updateData: any) {
    //console.log("updateData : ", updateData);
    this.userService.updateContacts(updateData).subscribe(
      (response) => {
        console.log("Successfully updated", response);
        // alert("Invited column updated!!");
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Contacts updated', life: 5000  });

        this.show_contacts();
        // Update the dataSource to reflect the changes
        // const updatedUserIndex = this.dataSource.data.findIndex(user => user.id === updateData.id);
        // if (updatedUserIndex !== -1) {
        //   this.dataSource.data[updatedUserIndex].status = 'Invitation Sent';
        //   this.dataSource.data[updatedUserIndex].invited = 'Y';
        //   this.dataSource._updateChangeSubscription();
        // }
      },
      (error) => {
        console.log("Error in Saving", error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 5000  });

      }
    );
  }
  
  
}
