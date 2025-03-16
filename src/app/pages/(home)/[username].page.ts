import { switchMap, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject, OnInit, computed, effect } from '@angular/core';
import { ProfileService, EnrichedProfile } from '@services/profile.service';
import { ProfileComponent } from '@components/profile/profile.component';
import { RouteMeta } from '@analogjs/router';
import { NavigationService } from '@services/navigation.service';
import { UserService } from '@services/user.service';
import { usernameExistsGuard } from '@shared/guards/username.guard';

// Add route metadata for guard
export const routeMeta: RouteMeta = {
  title: 'User Profile',
  canActivate: [usernameExistsGuard],
};

@Component({
  standalone: true,
  imports: [CommonModule, ProfileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (profile()) {
      <App-profile [profile]="profile()!" [isProfileOwner]="currentUserIsOwner()" />
    } @else {
      <div class="text-center py-12">
        <p class="text-gray-500 dark:text-gray-400">Loading profile...</p>
      </div>
    }
  `,
})
export default class UsernameProfilePageComponent implements OnInit {
  private profileService = inject(ProfileService);
  private route = inject(ActivatedRoute);
  private navigationService = inject(NavigationService);
  private userService = inject(UserService);

  // Current user
  currentUser = toSignal(this.userService.current_user$);

  constructor() {
    effect(() => {
      console.log(this.profile());
    });
  }

  ngOnInit() {
    // Set navigation state to profile
    this.navigationService.updateNavState('profile');
  }

  // Convert the route params Observable directly to a Signal
  profile = toSignal(
    this.route.params.pipe(
      switchMap((params) => {
        // Check for username from the new route format
        const username = params['username'];
        console.log(username);
        if (username) {
          // If username is provided in the route, fetch by username
          return this.profileService.getEnrichedProfileByUsername(username);
        }

        // Legacy route parameters for backward compatibility
        const uid = params['uid'];
        if (uid) {
          // If uid is provided in the route, fetch by uid
          return this.profileService.getEnrichedProfileByUid(uid);
        }

        // If neither is provided, fetch the current user's profile
        return this.profileService.getCurrentEnrichedProfile();
      }),
      // Map null to a default profile to avoid null reference issues
      map((profile) => profile || null),
    ),
    { initialValue: null as EnrichedProfile | null },
  );

  // Computed property to determine if the current user is the profile owner
  currentUserIsOwner = computed(() => {
    const currentUser = this.currentUser();
    const profileUser = this.profile();

    // Check if both users exist and if their usernames or emails match
    return !!(
      currentUser &&
      profileUser &&
      (currentUser.username === profileUser.username || currentUser.email === profileUser.email)
    );
  });
}
