import { Component } from '@angular/core';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css'
})
export class AccountDetailsComponent {
  website='';


  onSubmit() {
    console.log(this.website);
    this.website='';

  }
}
