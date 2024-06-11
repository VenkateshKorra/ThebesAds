import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivityTrackerService } from '../activity-tracker.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  current_link='';
  storage=false;
  private readonly idleTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(private router: Router, private activityTracker: ActivityTrackerService) {}

  ngOnInit(): void {
    this.activityTracker.startWatching(this.idleTimeout);
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.activityTracker.stopWatching();
  }

}
