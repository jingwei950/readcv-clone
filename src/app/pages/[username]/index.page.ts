import { switchMap, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileService, EnrichedProfile } from '@services/profile.service';
import { ProfileComponent } from '../../shared/components/profile/profile.component';

@Component({
  standalone: true,
  imports: [CommonModule, ProfileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto py-8">
      @if (profile()) {
        <App-profile [profile]="profile()!" />
      } @else {
        <div class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
      }
    </div>
  `,
})
export default class UsernameProfilePageComponent {
  private profileService = inject(ProfileService);
  private route = inject(ActivatedRoute);

  // Convert the route params Observable directly to a Signal
  profile = toSignal(
    this.route.params.pipe(
      switchMap((params) => {
        // Check for username from the new route format
        const username = params['username'];
        if (username) {
          // If username is provided in the route, fetch by username
          return this.profileService.getEnrichedProfileByUsername(username);
        }

        console.log(username);

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
}
