import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { countries } from '../sign-up-dropdown';

@Component({
  selector: 'app-account-detail-admin',
  templateUrl: './account-detail-admin.component.html',
  styleUrl: './account-detail-admin.component.css'
})
export class AccountDetailAdminComponent implements OnInit {
  // country="India";
   Name = '';
   Status='';
   Margin ='';
   Country='';
   Phone='';
   Email ='';
   countries_options:any;


  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.countries_options = countries;
      this.route.params.subscribe(params => {
        const name = params['name'];
        this.Name = name;

      })
  }

}
