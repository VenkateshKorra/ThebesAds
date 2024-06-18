import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-contact-reject',
  templateUrl: './contact-reject.component.html',
  styleUrl: './contact-reject.component.css'
})
export class ContactRejectComponent {
  reason: string = '';

  constructor(
    public dialogRef: MatDialogRef<ContactRejectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient) {}

    
    onCancel(): void {
      this.dialogRef.close();
    }

    onReject(): void {

      this.dialogRef.close(this.reason);
      
    }
}
