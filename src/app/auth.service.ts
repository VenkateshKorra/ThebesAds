// import { Injectable, Inject } from '@angular/core';
// import { DOCUMENT } from '@angular/common';
// import { Router } from '@angular/router';
// import { Observable, Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private inactivityDuration = 300; // 5 minutes in seconds
//   private userActivity: Subject<void> = new Subject<void>();
//   private timer: any;

//   constructor(private router: Router, @Inject(DOCUMENT) private document: Document) {
//     this.resetTimer();
    // this.initTimer();
    
//   }

//   // Initialize the inactivity timer
//   private initTimer(): void {
//     if (this.document.defaultView) {
//       this.userActivity.subscribe(() => this.resetTimer());
//       this.document.defaultView.addEventListener('mousemove', () => this.userActivity.next());
//       this.document.defaultView.addEventListener('scroll', () => this.userActivity.next());
//       this.document.defaultView.addEventListener('keypress', () => this.userActivity.next());
//       this.startTimer();
//     }
//   }

//   // Reset the timer when there is user activity
//   private resetTimer(): void {
//     clearTimeout(this.timer);
//     this.startTimer();
//   }

//   // Start the timer
//   private startTimer(): void {
//     this.timer = setTimeout(() => {
//       this.logout();
//     }, this.inactivityDuration * 1000); // Convert seconds to milliseconds
//   }

//   // Logout the user
//   logout(): void {
//     if (typeof localStorage !== 'undefined') {
//       localStorage.clear();
//       console.log('User logged out due to inactivity');
//     } else {
//       console.log('Unable to clear localStorage: localStorage is not available.');
//     }
    
//     this.router.navigate(['/login']);
//   }
  

//   // Method to signal user activity
//   signalActivity(): void {
//     this.userActivity.next();
//   }

//   // Method to reset the state of AuthService
//   resetState(): void {
//     clearTimeout(this.timer); // Reset the timer
//     // Additional reset logic if needed
//   }
// }


