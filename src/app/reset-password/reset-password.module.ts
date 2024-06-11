import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    // ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    MatIconModule, 
    FormsModule
  ]
})
export class ResetPasswordModule { }
