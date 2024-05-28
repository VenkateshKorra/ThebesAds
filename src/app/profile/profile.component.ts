import { Component, OnInit } from '@angular/core';
import { countries } from '../sign-up-dropdown';
import { UsersService } from '../users.service';

countries

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  email='';
  name="";
  status="";
  publisher_id: any;
  percent : any;
  Phone ='';
  address = '';
  country = '';
  country_list: any;
  tax_info= '';
  network_id = '';

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.country_list = countries;
  const userData = typeof localStorage !=undefined ? localStorage.getItem('userData'): null;
  const userName = typeof localStorage !=undefined ? localStorage.getItem('userName'): null;
  const publisherId = typeof localStorage != undefined ? localStorage.getItem('PublisherID'): null;
  const userAllData = typeof localStorage != undefined ? localStorage.getItem('UserInfo'): null;
  if(userData && userName && userAllData) {
    const user =JSON.parse(userData);
    const userInfoData = JSON.parse(userAllData);
    this.email= user.Email_Id;
    this.name=userName;
    this.status=user.Status;
    this.publisher_id = userInfoData['GAM_Publisher ID'];
    // console.log('name and mail is', this.email, this.name);
  }
  if(this.userService.getType()!='Admin' && userAllData) {
    const userInfo = JSON.parse(userAllData);
    this.percent = userInfo.Margin || 0;
    this.Phone = userInfo.Phone;
    this.country = userInfo.Country;
    this.network_id = userInfo['GAM_Network ID'] || 0;

  }
  
}
}
