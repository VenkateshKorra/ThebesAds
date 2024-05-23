import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-apps-app-mcm',
  templateUrl: './apps-app-mcm.component.html',
  styleUrl: './apps-app-mcm.component.css'
})
export class AppsAppMCMComponent implements OnInit {
  delegation_type='Managed Inventory';
  publisherName ='';
  networkCode = '';
  status = '';
  publisherEmail ='';
  sellerId ='';
  approvedOn='';

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    const userDetail = this.userService.getUserDetails();
  if(userDetail!= undefined || userDetail!= null) {
    this.publisherName = userDetail.publisher_name;
    this.networkCode = userDetail.network_id || 0;
    this.status = userDetail.status;
    this.publisherEmail = userDetail.email;
    this.sellerId = userDetail.publisher_id || 0;
    this.approvedOn = userDetail.approved_on || 0;

    }
  }
  
}
