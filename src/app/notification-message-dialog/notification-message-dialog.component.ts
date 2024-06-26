import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-message-dialog',
  templateUrl: './notification-message-dialog.component.html',
  styleUrl: './notification-message-dialog.component.css'
})
export class NotificationMessageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NotificationMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    closeDialog(): void {
      this.dialogRef.close();
    }
}
