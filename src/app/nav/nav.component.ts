import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  current_link='';
  userName: any;
  clicked=false;
  email=''

  constructor(private router: Router, private userService: UsersService) {}
  

  ngOnInit(): void {
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe(() => {
    //   const currentUrl = this.router.url;
    //   this.current_link = currentUrl;
    //   //console.log(this.current_link);
    // });

    const userData = typeof localStorage !== 'undefined' ? localStorage.getItem('userData') : null;

    if (userData) {
      this.userName =  localStorage.getItem('userName');
      // console.log("Email sent to get name is: ",this.email);
      // this.userService.get_user_name(emailSent).subscribe(
      //   (response) => {
      //     this.userName=response.data.Name;
      //     localStorage.setItem('userName', this.userName);
      //     console.log('Response of user name is: ', response);
      //     console.log(this.userName);
      //   }, 
      //   (error) => {
      //     console.log('Error getting user name', error);
      //     alert("can't find the name");
      //     localStorage.clear();
      //     this.router.navigate(['/login']);
          
      //   }
      // )
    }

  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  profileClicked() {
    this.clicked= !this.clicked;
  }
  profile() {
    this.router.navigate(['/profile']);
  }

  change_password() {
    this.router.navigate(['/change-password']);
  }

}
