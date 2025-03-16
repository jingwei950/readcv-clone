import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProfileService } from '@services/profile.service';
import { map, catchError, of } from 'rxjs';

/**
 * Guard that checks if a username exists
 * Returns true if username exists, redirects to home if username doesn't exist
 */
export const usernameExistsGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const profileService = inject(ProfileService);

  // Try to get username from multiple possible sources
  // 1. Try from paramMap (primary method for AnalogJS)
  let username = route.paramMap.get('username');

  // 2. If not found, try from params object
  if (!username && route.params['username']) {
    username = route.params['username'];
  }

  // 3. If still not found, try to extract from URL (last resort)
  if (!username) {
    const urlParts = state.url.split('/').filter(Boolean);
    if (urlParts.length > 0) {
      // If the URL is in the format /:username, the username should be the first part
      username = urlParts[0];
    }
  }

  if (!username) {
    console.warn('No username found in route params');
    return of(router.createUrlTree(['/']));
  }

  // Check if the username exists
  return profileService.getEnrichedProfileByUsername(username).pipe(
    map((profile) => {
      if (profile) {
        return true;
      }
      console.warn(`Username ${username} does not exist, redirecting to home`);
      return router.createUrlTree(['/']);
    }),
    catchError((error) => {
      console.error(`Error checking username ${username}:`, error);
      return of(router.createUrlTree(['/']));
    }),
  );
};
