import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { countries } from '../sign-up-dropdown';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-account-detail-admin',
  templateUrl: './account-detail-admin.component.html',
  styleUrl: './account-detail-admin.component.css'
})
export class AccountDetailAdminComponent implements OnInit {
  // country="India";
   Name: any;
   Status='';
   Margin ='';
   Country='';
   Phone='';
   Email ='';
   countries_options:any;


  constructor(private userService: UsersService ) {}

  ngOnInit(): void {
    // this.countries_options = countries;
    //   this.route.params.subscribe(params => {
    //     const name = params['name'];
        

    //   })
      this.Name = this.userService.getSetPublisherName();
      console.log('User Name is: ', this.Name);
      
  }

}
