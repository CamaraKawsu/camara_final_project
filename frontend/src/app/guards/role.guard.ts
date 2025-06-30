import { Injectable } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Array<string>;
  const currentUser = authService.getCurrentUser();

  if (currentUser && expectedRoles.includes(currentUser.role)) {
    return true;
  } else {
    // Role not authorized, redirect to home or unauthorized page
    alert('You do not have permission to access this page.');
    return router.createUrlTree(['/']); // Or a specific 'unauthorized' page
  }
};
