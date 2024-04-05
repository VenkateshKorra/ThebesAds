import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  email='';
  name="";
  status="";


  ngOnInit(): void {
  const userData = typeof localStorage !=undefined ? localStorage.getItem('userData'): null;
  const userName = typeof localStorage !=undefined ? localStorage.getItem('userName'): null;
  if(userData && userName) {
    const user =JSON.parse(userData);
    this.email= user.email_id;
    this.name=userName;
    this.status=user.status;
    // console.log('name and mail is', this.email, this.name);
    
  }
}
}
