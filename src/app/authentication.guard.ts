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

    if (user) {
      switch (user.Type) {
        case 'Admin':
          // Admin has access to all routes
          return true;

        case 'Publisher':
          const allowedRoutesForPublisher = [
            'home', 'user-dashboard', 'account-details-apps', 'account-sites', 'site-ad-units', 'apps-app-ad-units-list',
            'add-site-ad-units', 'add-app-ad-units', 'report-download', 'profile', 'payment', 'download-invoice',
            'address-tab', 'contacts-tab', 'top-performers', '**'
          ];
          const requestedRoutePublisher = state.url.substring(1); // Remove leading slash
          if (allowedRoutesForPublisher.includes(requestedRoutePublisher)) {
            return true;
          }
          break;
        case 'Distributor':
          // Both Publisher and Distributor have access to the same routes
          const allowedRoutesForDistributor = [
            'home','admin-accounts-list', 'admin-dashboard', 'account-details-apps', 'account-sites', 'site-ad-units', 'apps-app-ad-units-list','distributor-payment',
            'add-site-ad-units', 'add-app-ad-units', 'report-download', 'profile', 'payment', 'download-invoice',
            'address-tab', 'contacts-tab', 'top-performers', '**'
          ];
          const requestedRouteDistributor = state.url.substring(1); // Remove leading slash
          if (allowedRoutesForDistributor.includes(requestedRouteDistributor)) {
            return true;
          }
          break;

        case 'AdOpsManager':
          // AdOps Manager has access to Admin routes but restricted to specific publisher account details
          // const allowedRoutesForAdOpsManager = [
          //   'home', 'user-dashboard', 'account-details-apps', 'account-sites', 'site-ad-units', 'apps-app-ad-units-list',
          //   'add-site-ad-units', 'add-app-ad-units', 'report-download', 'profile', 'payment', 'download-invoice',
          //   'address-tab', 'contacts-tab', '**'
          // ];
          // const requestedRouteAdOpsManager = state.url.substring(1); // Remove leading slash
          // if (allowedRoutesForAdOpsManager.includes(requestedRouteAdOpsManager) || user.assignedPublishers.includes(requestedRouteAdOpsManager)) {
          //   return true;
          // }
          return true;
          break;

        case 'Finance':
          // Finance has access to specific routes
          const allowedRoutesForFinance = [
            'finance-dashboard', 'finance-reports', 'payment-overview', 'invoice-management', 'ad-serving-cost'
          ];
          const requestedRouteFinance = state.url.substring(1); // Remove leading slash
          if (allowedRoutesForFinance.includes(requestedRouteFinance)) {
            return true;
          }
          break;

        default:
          // Default case for any undefined roles
          break;
      }
    }
  }

  // Redirect to login page if user is not authorized
  _router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
