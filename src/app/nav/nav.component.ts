import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UsersService } from '../users.service';
import { isPlatformBrowser } from '@angular/common';

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
  typeOfUser = '';

  constructor(private router: Router, private userService: UsersService, @Inject(PLATFORM_ID) private platformId: Object) {}
  

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', this.onDocumentClick);
  }
  this.typeOfUser = this.userService.getType();
    const userData = typeof localStorage !== 'undefined' ? localStorage.getItem('userData') : null;

    if (userData) {
      this.userName =  localStorage.getItem('userName');
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

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
        document.removeEventListener('click', this.onDocumentClick);
    }
}

  onDocumentClick = (event: MouseEvent) => {
    const dropdownElement = document.querySelector('.dropdown');
    const profileElement = document.querySelector('.profile');

    // Check if the click was inside the dropdown or the profile element
    const isClickInsideDropdown = dropdownElement?.contains(event.target as Node);
    const isClickInsideProfile = profileElement?.contains(event.target as Node);
    
    // If the click was outside both, hide the dropdown
    if (!isClickInsideDropdown && !isClickInsideProfile) {
      this.clicked = false;
    }
  }

  addressComponent() {
    this.router.navigate(['/address-tab']);
  }

  contactsComponent() {
    this.router.navigate(['/contacts-tab']);
  }

  user_management() {
    this.router.navigate(['/user-details']);
  }

}
