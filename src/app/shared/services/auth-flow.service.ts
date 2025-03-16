import { Injectable, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User as FirebaseUser, UserCredential } from '@angular/fire/auth';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthFlowService {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private profileService = inject(ProfileService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Listen for email link authentication results
    this.authService.emailLinkAuthResult$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        this.handleAuthSuccess(result);
      }
    });
  }

  /**
   * Register a new user with email and password
   */
  async registerWithEmailAndPassword(email: string, password: string): Promise<boolean> {
    const result = await this.authService.emailPasswordAuth(email, password, true);
    return this.handleAuthSuccess(result);
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmailAndPassword(email: string, password: string): Promise<boolean> {
    const result = await this.authService.emailPasswordAuth(email, password, false);
    return this.handleAuthSuccess(result);
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<boolean> {
    const result = await this.authService.googleAuth();
    return this.handleAuthSuccess(result);
  }

  /**
   * Handle successful authentication
   * Creates user profile for new users
   */
  private async handleAuthSuccess(result: UserCredential | null): Promise<boolean> {
    if (!result) return false;

    try {
      const isNewUser = this.authService.isNewUser(result);

      if (isNewUser) {
        // Create user account first
        await this.userService.createUserProfile(result.user);

        // Then create a profile document for the new user
        await this.profileService.createNewUserProfile(result.user);
      }

      return true;
    } catch (error) {
      console.error('Auth flow failed:', error);
      return false;
    }
  }

  /**
   * Update user profile with username and display name
   */
  async updateUserProfile(user: FirebaseUser, displayName: string, username: string): Promise<boolean> {
    try {
      // Update user info first
      await this.userService.createUserProfile(user, displayName, username);

      // Then create/update profile for the user
      await this.profileService.createNewUserProfile(user);

      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  /**
   * Sign out the current user
   */
  signOut(): void {
    this.authService.logout();
  }
}
