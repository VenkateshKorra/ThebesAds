import { Component } from '@angular/core';
import { skip } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {


  overView=[false, false, false];
  monetize=[false, false, false, false, false, false];

  firstItem:boolean=false;
  secondItem: boolean=false;
  
  item1: boolean =false;
  item2: boolean = false;
  isUp1: boolean=false;

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

}
