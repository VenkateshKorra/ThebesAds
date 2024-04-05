import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  current_link='';
  storage=false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = this.router.url;
      this.current_link = currentUrl;
      //console.log(this.current_link);
      if (typeof localStorage !== 'undefined' && localStorage !== null && localStorage.length > 0) {
        // Access localStorage here
        // For example:
        this.storage = true;
      } else {
        this.storage = false;
      }
      
    });

  }

}
