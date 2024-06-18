import { AfterViewInit, Component, HostListener, OnInit, ViewChild, isDevMode } from '@angular/core';
import { Months } from '../sign-up-dropdown';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MessageService } from 'primeng/api';

interface Serving_Cost {
  id: any;
  month: any;
  serving_cost: any;
  created_by: any;
  user_id: any;
  created_on: any;
  updated_on: any;
  showOptions: boolean;
}

@Component({
  selector: 'app-ad-serving-cost',
  templateUrl: './ad-serving-cost.component.html',
  styleUrl: './ad-serving-cost.component.css'
})
export class AdServingCostComponent implements OnInit, AfterViewInit {

  month_list: any;
  month_selected ='';
  year_selected = '';
  ad_serving_cost: any;

  yearTextLength = false;
  ad_cost_TextLength =false;
  edit_ad_cost_length = false;

  editId = '';
  editMonth = '';
  editYear = '';
  editAdServingCost: any;

  isOpen = false;
  isEdit = false;

  
  displayedColumns: string[] = ['id', 'month', 'serving_cost', 'created_by', 'user_id', 'created_on', 'updated_on', 'action'];
  dataSource = new MatTableDataSource<Serving_Cost>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UsersService, private messageService: MessageService ) {}

  ngOnInit(): void {
      this.month_list = Months;
      this.get_data();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onCancel() {
    this.isOpen = false;
  }

  onCancelEdit() {
    this.isEdit = false
  }
  openAddDialog() {
    this.isOpen = true;
  }

  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    // console.log('Clicked element is: ', clickedElement);
    this.dataSource.data.forEach((element: Serving_Cost) => {
        // Check if the clicked element is outside the action button or dropdown for the current element
        if (!this.isActionButtonOrDropdown(clickedElement, element)) {
            // Hide the dropdown by setting showOptions to false
            element.showOptions = false;
        }
    });
    // Perform change detection if necessary
    this.dataSource.data = [...this.dataSource.data];
}

isActionButtonOrDropdown(clickedElement: HTMLElement, element: Serving_Cost): boolean {
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


  get_data() {
    this.userService.get_ad_serving_cost_data().subscribe(
      (response) => {
        const mappedUser:[Serving_Cost] = response.data.map((user: any) => ({
          id: user.Id,
          month: user.Month,
          serving_cost: user.Serving_Cost, 
          created_by: user.Created_By, 
          user_id: user.User_Id,
          created_on: user.Created_On,
          updated_on: user.Updated_On, 
          showOptions: false
        }));

        this.dataSource.data = mappedUser;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
          // this.dataSource.paginator.lastPage();
        }
      }, 
      (error) => {
        console.log('Error Fetching :', error);
        this.userService.logoutUser(error.error.error);
        // alert('Error Fetching site table!!');
       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Fetching  table!!'+error.error, life: 5000  });
      }
    )
  }

  performAction(element: Serving_Cost) {
    //console.log("Button value is ", element);
    //alert('Action button is clicked');
    this.dataSource.data.forEach((item: any) => {
      if(item !== element) {
        item.showOptions = false;
      }
    })
    element.showOptions = !element.showOptions;
}

checkAdCost() {
  if(this.ad_serving_cost >100 || this.ad_serving_cost < 0) {
    this.ad_cost_TextLength = true;
  }
  else {
    this.ad_cost_TextLength = false;
  }
}

checkEditAdCost() {
  if(this.editAdServingCost >100 || this.editAdServingCost < 0) {
    this.edit_ad_cost_length = true;
  }
  else {
    this.edit_ad_cost_length = false;
  }
}



  onSubmit(form: NgForm) {
    console.log('Form is: ', form.valid);

    
    if(form.valid && !this.ad_cost_TextLength) {
      const Data = {
        Month: this.month_selected, 
        Year: this.year_selected, 
        Serving_Cost: this.ad_serving_cost
      }
      this.isOpen= false;
      console.log('Data is: ', Data);
      this.userService.add_ad_serving_record(Data).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record added Successfully!!', life: 5000  });
          this.get_data();
        },
        (error) => {
          console.log('Error: ', error);
          this.userService.logoutUser(error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding ad cost!!'+error.error.error, life: 5000  });
        }
      )
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all input fields fields correctly', life: 5000  });
    }
    this.month_selected = '';
    this.year_selected = '';
    this.ad_serving_cost= '';
  }

  editRecord(element: Serving_Cost) {
    const temp = element.month.toString();
    const [month, year] = temp.split('-');
    this.editId = element.id;
    this.editMonth = month;
    this.editYear = year;
    this.editAdServingCost = element.serving_cost;


    this.isEdit = true;
    console.log('Ad servingcost is: ', this.editAdServingCost);
    

  }

  onUpdate(form: NgForm) {

    if(form.valid && !this.edit_ad_cost_length) {
    const Data = {
      Id: this.editId,
      Month: this.editMonth,
      Year: this.editYear,
      Serving_Cost: this.editAdServingCost
    }
    console.log('Data sent for delete is: ', Data);

    this.userService.edit_ad_serving_record(Data).subscribe(
      (response) => {
        this.isEdit = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully!!', life: 5000  });
        this.get_data();
      },
      (error) => {
        this.isEdit = false;
        console.log('Error: ', error);
          this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating record!! '+error.error.error, life: 5000  });
      }
    )
  }
  else {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all input fields fields correctly', life: 5000  });
  }
  }

  deleteRecord(element: Serving_Cost) {
    const temp = element.month.toString();
    const [month, year] = temp.split('-');
    // console.log('Data is: ', temp);
    // console.log('year and month is: ', year, month);
    const Data = {
      Id: element.id,
      Month: month,
      Year: year,
      Serving_Cost: element.serving_cost
    }
    console.log('Data sent for delete is: ', Data);

    this.userService.delete_ad_serving_record(Data).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully!!', life: 5000  });
        this.get_data();
      },
      (error) => {
        console.log('Error: ', error);
        this.userService.logoutUser(error.error.error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting record!! '+error.error.error, life: 5000  });
      }
    )
    
  }

  checkYearLength() {
    console.log('Year length is: ', this.year_selected);
    
    if(this.year_selected.length >5) {
      this.yearTextLength = true;
    }
    else {
      this.yearTextLength = false;
    }
  }

  checkAdCostLength() {
    console.log('ad cost length is: ', this.ad_serving_cost);
    if(this.ad_serving_cost.length >5) {
      this.ad_cost_TextLength = true;
    }
    else {
      this.ad_cost_TextLength = false;
    }
  }

}
