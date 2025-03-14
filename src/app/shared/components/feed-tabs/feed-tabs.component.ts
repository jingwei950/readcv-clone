import { Location, NgClass } from '@angular/common';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { NavigationService } from '@services/navigation.service';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { UserService } from '@services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from '@components/svg-icon/svg-icon.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { Router } from '@angular/router';

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
        navService.navState() === 'msg' || navService.navState() === 'bookmark' || navService.navState() === 'profile'
          ? 'justify-start'
          : 'justify-center',
        navService.navState() !== 'profile' ? 'border-b border-gray-300 dark:border-primaryBorderColor' : 'border-0',
      ]"
    >
      @if (navService.navState() === 'home') {
        @for (button of filterButtons; track $index) {
          <button
            hlmBtn
            variant="link"
            (click)="changeFilterState(button === 'highlights' ? 'highlights' : 'everyone', 'home')"
            class="capitalize"
            [ngClass]="{
              '!text-gray-500': navService.filterState() !== button,
            }"
          >
            {{ button }}
          </button>
        }
      } @else if (navService.navState() === 'noti') {
        @for (button of notiButtons; track $index) {
          <button
            hlmBtn
            variant="link"
            (click)="changeFilterState(button === 'all' ? 'all' : 'mentions', 'notification')"
            class="capitalize"
            [ngClass]="{
              '!text-gray-500': navService.notificationFilterState() !== button,
            }"
          >
            {{ button }}
          </button>
        }
      } @else if (navService.navState() === 'msg') {
        <p class="font-medium text-sm text-primary">Replies</p>
      } @else if (navService.navState() === 'bookmark') {
        <p class="font-medium text-sm text-primary">Bookmarks</p>
      } @else if (navService.navState() === 'profile') {
        <button (click)="backClick()">
          <ng-icon hlm size="base" name="lucideArrowLeft" class="dark:text-grey1 min-w-12" />
        </button>
        <p class="font-medium text-sm text-grey1">&#64;{{ currentUser()?.username }}</p>
      }
    </div>
  `,
})
export class FeedTabsComponent {
  private userService = inject(UserService);
  private location = inject(Location);
  private router = inject(Router);
  navService = inject(NavigationService);

  currentUser = toSignal(this.userService.current_user$);

  constructor() {
    effect(() => {
      console.log(this.currentUser());
    });
  }

  notiButtons = ['all', 'mentions'];
  filterButtons = ['highlights', 'everyone'];

  changeFilterState(state: string, filterType: string) {
    if (filterType === 'home') {
      this.navService.filterState.update(() => state);
    } else if (filterType === 'notification') {
      this.navService.notificationFilterState.update(() => state);
    }
  }

  backClick() {
    // Dynamic navigation back to previous page when on profile page
    if (this.navService.navState() === 'profile') {
      // Get the previous state and its path
      const previousState = this.navService.previousNavState();
      const previousPath = this.navService.getPreviousStatePath();

      // Navigate to the previous path
      this.router.navigate([previousPath]);

      // Update the navigation state to the previous state
      this.navService.navState.set(previousState);

      // Update the icon state using the service method
      this.navService.updateIconSelectedState(previousState);
    } else {
      this.location.back();
    }
  }
}
