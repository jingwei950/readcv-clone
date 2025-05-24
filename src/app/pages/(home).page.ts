// Angular imports
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

// Components
import { NavigationComponent } from '@components/navigation/navigation.component';
import { JobListingsComponent } from '@components/job-listings/job-listings.component';
import { UsernameDialogComponent } from '@components/username-dialog/username-dialog.component';
import { FeedTabsComponent } from '@components/feed-tabs/feed-tabs.component';
import { PostCardComponent } from '@components/post-card/post-card.component';
import { PostComposerComponent } from '@components/post-composer/post-composer.component';

// Services
import { ResponsiveBreakpointService } from '@services/responsive-breakpoint.service';
import { FeedService } from '@services/feed.service';
import { UserService } from '@services/user.service';
import { NavigationService } from '@services/navigation.service';
import { AsyncPipe } from '@angular/common';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent,
    JobListingsComponent,
    UsernameDialogComponent,
    FeedTabsComponent,
    PostCardComponent,
    PostComposerComponent,
    AsyncPipe,
  ],
  template: `
    <div class="w-full h-screen">
      <main class="flex justify-center mx-auto w-full max-w-[calc(300px+604px+300px)]">
        <!-- Navigation -->
        @if (!(screenSize.isHandset$ | async)) {
          <App-navigation class="flex-1" />
        }

        <!-- Main content section -->
        <div
          class="min-w-[420px] lg:max-w-[600px] w-full border-x border-gray-300 dark:border-primaryBorderColor min-h-screen"
        >
          <App-feed-tabs />

          <!-- Home page content (shown directly when on the root route) -->
          @if (isHomeRoute()) {
            @if (currentUser()) {
              <App-post-composer [currentUser]="currentUser()!" />
            }

            @if (navService.filterState() === 'highlights' && userEnrichedPost().length > 0) {
              @for (post of userEnrichedPost(); track $index) {
                <App-post-card [post]="post" />
              }
            } @else if (navService.filterState() === 'everyone') {
              <p>Everyone</p>
            }
          } @else {
            <!-- Other routes use the router outlet -->
            <router-outlet></router-outlet>
          }
        </div>

        <!-- Job listings -->
        @if (screenSize.isWeb$ | async) {
          <div class="max-w-[300px] max-h-screen h-auto w-full sticky top-0">
            <App-job-listings />
          </div>
        }

        <!-- Username dialog for new users -->
        <app-username-dialog></app-username-dialog>
      </main>
    </div>
  `,
})
export default class HomeLayoutComponent {
  screenSize = inject(ResponsiveBreakpointService);
  feedService = inject(FeedService);
  userService = inject(UserService);
  navService = inject(NavigationService);
  router = inject(Router);

  currentUser = toSignal(this.userService.current_user$);
  userEnrichedPost = toSignal(this.feedService.userEnrichedPost$, { initialValue: [] });

  // Track the current route to determine if we're on the home route
  currentRoute = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  // Check if we're on the home route (root path)
  isHomeRoute() {
    const route = this.currentRoute();
    return route === '/' || route === '';
  }

  constructor() {
    // When on the home route, ensure navigation state is set to home
    if (this.isHomeRoute()) {
      this.navService.updateNavState('home');
    }
  }
}
