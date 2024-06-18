import { Component, OnInit } from '@angular/core';
import { skip } from 'rxjs';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {


  overView=[false, false, false];
  monetize=[false, false, false, false, false, false];
  type='';

  firstItem:boolean=false;
  secondItem: boolean=false;
  
  item1: boolean =false;
  item2: boolean = false;
  isUp1: boolean=false;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    // const userDataString = typeof localStorage !== 'undefined' ? localStorage.getItem('userData') : null;
    // if (userDataString) {
    //   const userData = JSON.parse(userDataString);
    //   this.type = userData['Type'];
    // }

    this.type= this.userService.getType();
    console.log(this.type);
    
    
  }

  clicked1() {
    this.item1 = !this.item1;
  }
  clicked2() {
    this.item2 = !this.item2;
  }

  check(index: number, listName: any) {
    if (listName == 'overView') {
      this.firstItem=true
      this.secondItem=false;
      this.monetize.fill(false);
      this.overView.fill(false); // Reset all values to false
      this.overView[index] = true; // Set clicked index to true  
      //console.log(this.overView);
    } else if (listName == 'monetize') {
      this.secondItem=true;  
      this.firstItem=false;
      this.overView.fill(false);
      this.monetize.fill(false); // Reset all values to false
      this.monetize[index] = true; // Set clicked index to true
      //console.log(this.monetize);
      
    }

  }

  // getUserRoute(): string {
  //   return this.userService.getType()=='Admin'? '/admin-payment': '/payment';
  // }

}
