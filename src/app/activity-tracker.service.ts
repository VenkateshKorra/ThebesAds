import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActivityTrackerService {
  private userActivityEvents$!: Observable<Event>;
  private idleSubscription!: Subscription;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userActivityEvents$ = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'click')
      );
    }
  }

  public startWatching(timeout: number) {
    // console.log('Watching Started');
    
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.idleSubscription = this.userActivityEvents$
          .pipe(
            switchMap(() => timer(timeout)),
            tap(() => this.ngZone.run(() => this.logout()))
          )
          .subscribe();
      });
    }
  }
  

  private logout() {
    console.log('User Logged out due to inactivity');
    
    localStorage.clear();
    this.router.navigate(['/login']);
    // Clear any user data here, if needed.
  }

  public stopWatching() {
    console.log('Stopped watching');
    
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }
  }
}