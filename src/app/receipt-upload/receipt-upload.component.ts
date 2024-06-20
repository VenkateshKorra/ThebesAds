import { Component, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';
import { Months } from '../sign-up-dropdown';
import { NgForm } from '@angular/forms';



interface Receipt_upload {
  id: any;
  month: any;
  account_id: any;
  file_name: any;
  file_path: any;
  file_size: any;
  created_on: any;
  created_by: any;
  showOptions: boolean;
}

@Component({
  selector: 'app-receipt-upload',
  templateUrl: './receipt-upload.component.html',
  styleUrl: './receipt-upload.component.css'
})
export class ReceiptUploadComponent {

  displayedColumns: string[] = ['id', 'month', 'account_id', 'file_name', 'file_path', 'created_on', 'created_by', 'action'];
  dataSource = new MatTableDataSource<Receipt_upload>();
  isOpen = false;
  month_list: any;
  month_selected ='';
  year_selected = '';
  upload_file : any;
  publisher_id = '';
  isEdit = false;

  selectedFile: File | null = null;
  uploadMessage ='';
  uploaded_file_name: any;


  edit_month = '';
  edit_year='';


  constructor(private userService: UsersService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.month_list = Months;
    this.get_data();
}

@HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    // console.log('Clicked element is: ', clickedElement);
    this.dataSource.data.forEach((element: Receipt_upload) => {
        // Check if the clicked element is outside the action button or dropdown for the current element
        if (!this.isActionButtonOrDropdown(clickedElement, element)) {
            // Hide the dropdown by setting showOptions to false
            element.showOptions = false;
        }
    });
    // Perform change detection if necessary
    this.dataSource.data = [...this.dataSource.data];
}

isActionButtonOrDropdown(clickedElement: HTMLElement, element: Receipt_upload): boolean {
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
    this.userService.get_receipt_upload().subscribe(
      (response) => {
        const mappedUser:[Receipt_upload] = response.map((user: any) => ({
          id: user.Id,
          month: user.Month,
          account_id: user.Account_Id, 
          file_name: user.file_name,
          file_path: user.file_path, 
          file_size: user.file_size,
          created_on: user.Created_On,
          created_by: user.Created_By, 
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

  performAction(element: Receipt_upload) {
    //console.log("Button value is ", element);
    //alert('Action button is clicked');
    this.dataSource.data.forEach((item: any) => {
      if(item !== element) {
        item.showOptions = false;
      }
    })
    element.showOptions = !element.showOptions;
}

// editRecord(element: any) {
//   this.isEdit = true;
// }

// onUpdate(element: any) {

// }
deleteRecord(element: Receipt_upload) {
  const temp = element.month.toString();
  const [month, year] = temp.split('-');
  // console.log('Data is: ', temp);
  // console.log('year and month is: ', year, month);
  const Data = {
    Id: element.id,
    // Month: month,
    // Year: year,
  }
  console.log('Data sent for delete is: ', Data);

  this.userService.delete_receipt_record(Data).subscribe(
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

openAddDialog() {
  this.isOpen = true;
}
onCancel() {
this.isOpen = false;
}

uploadButtonClicked() {
  const fileInput: HTMLInputElement = document.createElement('input');
  fileInput.type = 'file';
  
  fileInput.id='fileInput';
  fileInput.accept='.pdf';

  // const elementData = {
  //   Month: this.month_selected,
  //   Year: this.year_selected,
  //   Publisher_Id: this.publisher_id
  // }

  console.log('Upload clicked');
  

  fileInput.addEventListener('change',(event)=> {
    this.onFileSelected(event)
  })

  fileInput.click();
}

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
  this.uploaded_file_name = this.selectedFile?.name;
  this.uploadMessage = '';
  // const EnteredData = {
  //   Month: this.month_selected,
  //   Year: this.year_selected
  // }
  // this.uploadInvoice(); // Pass the element to uploadInvoice
}

uploadInvoice() {
  if (!this.selectedFile) {
    this.uploadMessage = 'Please select a PDF file to upload.';
    return;
  }
  const Data = {
    selectedFile: this.selectedFile,
    publisher_id: this.publisher_id,
    Month: this.month_selected,
    Year: this.year_selected
  }
  console.log('Data send for creation: ', Data);

  const limit_set = this.userService.get_upload_file_limit();
    const maxFileSize = limit_set * 1024 * 1024;
    if(this.selectedFile.size > maxFileSize ) {
      // console.log('Uploaded size: ',this.selectedFile.size);
      // console.log('Set Limit size: ', maxFileSize);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `File Uploaded Exceeded limit size ${limit_set}MB`, life: 5000 });
    }
    else {
      this.userService.uploadReceipt(Data).subscribe(
        (response: any) => {
          if (response.success) {
            console.log('Receipt uploaded successfully!', response.filePath);
            this.get_data();
            this.isOpen = false;
          }
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File Upload Successfully', life: 5000 });
        },
        (error) => {
          this.isOpen = false;
          console.error('Error uploading file:', error);
          this.userService.logoutUser(error.error.error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error uploading file' + error.error.error, life: 5000 });
        }
      );
    }
  this.month_selected='';
  this.year_selected='';
  this.publisher_id='';
  this.uploaded_file_name='';
  this.selectedFile = null;
}


onSubmit(form: NgForm) {
  console.log('Submitted');
  console.log('Form is: ', form.valid);
  
  if(form.valid && this.selectedFile) {
    this.uploadInvoice();
  }
  else {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter all inputs correctly', life: 5000 });
  }
}
}
