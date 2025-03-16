// Angular imports
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import {
  effect,
  inject,
  Component,
  viewChild,
  ElementRef,
  ChangeDetectionStrategy,
  OnInit,
  computed,
} from '@angular/core';

// Components
import { FeedTabsComponent } from '../feed-tabs/feed-tabs.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { PostCardComponent } from '@components/post-card/post-card.component';
import { PostComposerComponent } from '../post-composer/post-composer.component';

// Services
import { FeedService } from '@services/feed.service';
import { AuthService } from '@services/auth.service';
import { NavigationService } from '@services/navigation.service';
import { ProfileService, EnrichedProfile } from '@services/profile.service';

// 3rd party imports
import { filter, map } from 'rxjs';
import { UserService } from '@services/user.service';

@Component({
  selector: 'App-post-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostCardComponent, ProfileComponent, FeedTabsComponent, PostComposerComponent],
  template: `
    <div class="inline-flex justify-center w-full border-x border-gray-300 dark:border-primaryBorderColor min-h-screen">
      <div class="flex flex-col w-full">
        <App-feed-tabs />

        @if (currentUser() && currentRoute() === '/') {
          <App-post-composer [currentUser]="currentUser()!" />
        }

        @switch (navService.navState()) {
          @case ('home') {
            @if (navService.filterState() === 'highlights' && userEnrichedPost().length > 0) {
              @for (post of userEnrichedPost(); track $index) {
                <App-post-card [post]="post" />
              }
            } @else if (navService.filterState() === 'everyone') {
              <p>Everyone</p>
            }
          }
          @case ('noti') {
            @if (navService.notificationFilterState() === 'all') {
              <p>All</p>
            } @else {
              <p>Mentions</p>
            }
          }
          @case ('search') {
            <p>Search</p>
          }
          @case ('msg') {
            <p>Message</p>
          }
          @case ('bookmark') {
            <p>bookmark</p>
          }
          @case ('profile') {
            <App-profile [profile]="userProfile()" [isProfileOwner]="currentUserIsOwner()"></App-profile>
          }
          @default {
            <!-- <App-post-card /> -->
          }
        }
      </div>
    </div>
  `,
})
export class PostFeedComponent implements OnInit {
  router = inject(Router);
  feedService = inject(FeedService);
  authService = inject(AuthService);
  userService = inject(UserService);
  profileService = inject(ProfileService);
  navService = inject(NavigationService);
  route = inject(ActivatedRoute);

  textareaRef = viewChild(ElementRef);

  // currentUser = this.authService.auth_user;
  currentUser = toSignal(this.userService.current_user$);
  userEnrichedPost = toSignal(this.feedService.userEnrichedPost$, { initialValue: [] });

  // Use the ProfileService to get the current user's enriched profile
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

  currentRoute = toSignal(
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).pipe(map((event) => event.url)),
    { initialValue: '' },
  );

  constructor() {
    effect(() => {
      this.textareaRef()?.nativeElement.addEventListener('input', () => {
        this.textareaRef()!.nativeElement.style.height = 'auto';
        this.textareaRef()!.nativeElement.style.minHeight = `${this.textareaRef()!.nativeElement.scrollHeight}px`;
      });

      // console.log(this.userProfile());
    });
  }

  ngOnInit() {
    // Check if we're on the profile page and update navigation state appropriately
    const route = this.currentRoute();
    if (route.includes('/profile')) {
      this.navService.updateNavState('profile');
    } else if (route.startsWith('/') && route.length > 1 && !route.includes('/')) {
      // This could be a username route (e.g., /jingwei950)
      // The check for route.length > 1 ensures it's not just the root route ('/')
      // The check for !route.includes('/') ensures no other route segments
      this.navService.updateNavState('profile');
    }
  }
}
