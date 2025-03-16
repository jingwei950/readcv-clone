// Angular imports
import { Component, inject, OnInit, computed } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

// Components
import { ProfileComponent } from '@components/profile/profile.component';

// Services
import { ProfileService, EnrichedProfile } from '@services/profile.service';
import { UserService } from '@services/user.service';
import { NavigationService } from '@services/navigation.service';

export const routeMeta: RouteMeta = {
  title: 'Profile',
};

@Component({
  standalone: true,
  imports: [ProfileComponent],
  template: ` <App-profile [profile]="userProfile()" [isProfileOwner]="currentUserIsOwner()"></App-profile> `,
})
export default class ProfilePageComponent implements OnInit {
  userService = inject(UserService);
  profileService = inject(ProfileService);
  navService = inject(NavigationService);

  // Current user
  currentUser = toSignal(this.userService.current_user$);

  // User profile
  userProfile = toSignal(
    this.profileService
      .getCurrentEnrichedProfile()
      .pipe(map((profile) => profile || ({ username: '', name: '', email: '', joinDate: null } as EnrichedProfile))),
    { initialValue: { username: '', name: '', email: '', joinDate: null } as EnrichedProfile },
  );

  // Computed property to determine if the current user is the profile owner
  currentUserIsOwner = computed(() => {
    const currentUser = this.currentUser();
    const profileUser = this.userProfile();

    // Check if both users exist and if their usernames or emails match
    return !!(
      currentUser &&
      profileUser &&
      (currentUser.username === profileUser.username || currentUser.email === profileUser.email)
    );
  });

  ngOnInit() {
    // Set navigation state to profile
    this.navService.updateNavState('profile');

    console.log('Profile page component initialized');
  }
}
