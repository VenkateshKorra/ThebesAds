import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.css'
})
export class ContactDialogComponent {
  reason: string = '';

  constructor(
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient) {}

    
    onCancel(): void {
      this.dialogRef.close();
    }

    onReject(): void {
      this.dialogRef.close(this.reason);
      
    }

    // onReject(): void {
    //   const userEmail = this.data.email; // Assuming the user email is in 'data'
    //   const reason = this.reason;
    
    //   const httpOptions = {
    //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    //   };
    
    //   this.http.post<any>('/api/reject-contact', { email: userEmail, message: reason }, httpOptions)
    //     .subscribe(response => {
    //       console.log('Contact rejection response:', response);
    //       // Handle successful rejection and potential error cases based on response status and data
    //       this.dialogRef.close(); // Close the dialog if successful
    //     }, error => {
    //       console.error('Error rejecting contact:', error);
    //       // Handle rejection errors (e.g., display error message to user)
    //     });
    // }
  }
