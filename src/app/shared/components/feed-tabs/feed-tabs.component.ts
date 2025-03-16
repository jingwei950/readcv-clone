import { Location, NgClass } from '@angular/common';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { NavigationService } from '@services/navigation.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '@services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'App-feed-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, HlmButtonModule, HlmIconDirective, NgIcon],
  providers: [provideIcons({ lucideArrowLeft })],
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    <div
      class="flex w-full bg-background items-center min-h-16 px-6 sticky top-0 z-50"
      [ngClass]="[
        navState() === 'msg' || navState() === 'bookmark' || navState() === 'profile'
          ? 'justify-start'
          : 'justify-center',
        navState() !== 'profile' ? 'border-b border-gray-300 dark:border-primaryBorderColor' : 'border-0',
      ]"
    >
      @if (navState() === 'home') {
        @for (button of filterButtons; track $index) {
          <button
            hlmBtn
            variant="link"
            (click)="changeFilterState(button === 'highlights' ? 'highlights' : 'everyone', 'home')"
            class="capitalize"
            [ngClass]="{
              '!text-gray-500': filterState() !== button,
            }"
          >
            {{ button }}
          </button>
        }
      } @else if (navState() === 'noti') {
        @for (button of notiButtons; track $index) {
          <button
            hlmBtn
            variant="link"
            (click)="changeFilterState(button === 'all' ? 'all' : 'mentions', 'notification')"
            class="capitalize"
            [ngClass]="{
              '!text-gray-500': notificationFilterState() !== button,
            }"
          >
            {{ button }}
          </button>
        }
      } @else if (navState() === 'msg') {
        <p class="font-medium text-sm text-primary">Replies</p>
      } @else if (navState() === 'bookmark') {
        <p class="font-medium text-sm text-primary">Bookmarks</p>
      } @else if (navState() === 'profile') {
        <button (click)="backClick()">
          <ng-icon hlm size="base" name="lucideArrowLeft" class="dark:text-grey1 min-w-12" />
        </button>
        <p class="font-medium text-sm text-grey1">&#64;{{ profileUsername() }}</p>
      }
    </div>
  `,
})
export class FeedTabsComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  private location = inject(Location);
  private navService = inject(NavigationService);

  navState = this.navService.navState;
  filterState = this.navService.filterState;
  notificationFilterState = this.navService.notificationFilterState;
  notiButtons = ['all', 'mentions'];
  filterButtons = ['highlights', 'everyone'];

  currentUser = toSignal(this.userService.current_user$);
  profileUsername = toSignal(
    this.router.events.pipe(
      map(() => {
        const urlSegments = this.router.url.split('/');
        // Get the username from the URL (if present)
        const usernameFromUrl = urlSegments.length > 1 ? urlSegments[1] : '';
        // Return username from URL or fallback to current user's username
        return usernameFromUrl || this.currentUser()?.username || '';
      }),
    ),
    { initialValue: '' },
  );

  // constructor() {
  //   effect(() => {
  //     console.log('Current user:', this.currentUser());
  //     console.log('Profile username:', this.profileUsername());
  //   });
  // }

  changeFilterState(state: string, filterType: string) {
    if (filterType === 'home') {
      this.navService.filterState.update(() => state);
    } else if (filterType === 'notification') {
      this.navService.notificationFilterState.update(() => state);
    }
  }

  backClick() {
    // Dynamic navigation back to previous page when on profile page
    if (this.navState() === 'profile') {
      // Get the previous state and its path
      const previousState = this.navService.previousNavState();
      const previousPath = this.navService.getPreviousStatePath();

      console.log(previousPath);

      // Navigate to the previous path
      this.router.navigate([previousPath]);

      // Update the navigation state to the previous state
      this.navState.set(previousState);

      // Update the icon state using the service method
      this.navService.updateIconSelectedState(previousState);
    } else {
      this.location.back();
    }
  }
}
