import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from './auth.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  // const authService = inject(AuthService);
  const userData = typeof localStorage !== 'undefined' ? localStorage.getItem('userData') : null;

  // authService.resetState();

  // authService.signalActivity();

  if (userData) {
    const user = JSON.parse(userData);
    
    // Check if user is logged in and has a valid type
    if (user && user.Type === 'Admin') {
      // If user is admin, allow access to all routes
      return true;
    }
    if (user && user.Type === 'Publisher') {
      // If user is publisher, restrict access to specific routes
      const allowedRoutesForPublisher = ['home', 'user-dashboard', 'account-details-apps', 'account-sites', 'site-ad-units', 'apps-app-ad-units-list', 'add-site-ad-units', 'add-app-ad-units', 'report-download','profile', 'payment', 'download-invoice', '**'];
      const requestedRoute = state.url.substring(1); // Remove leading slash
      
      if (allowedRoutesForPublisher.includes(requestedRoute)) {
        // Allow access to the requested route for publisher user
        return true;
      }
    }
  }

  // alert('Only admin can access this page');
  _router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
