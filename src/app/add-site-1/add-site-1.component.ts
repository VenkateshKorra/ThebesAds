import { Component } from '@angular/core';

@Component({
  selector: 'app-add-site-1',
  templateUrl: './add-site-1.component.html',
  styleUrl: './add-site-1.component.css'
})
export class AddSite1Component {
  isOpen= true;

  close() {
    this.isOpen=!this.isOpen;
  }
}
