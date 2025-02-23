import { NgClass } from '@angular/common';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { NavigationService } from '@services/navigation.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'App-feed-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, HlmButtonModule],
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    <div
      class="flex w-full border-b border-gray-300 dark:border-primaryBorderColor bg-background items-center min-h-16 px-6 sticky top-0 z-50"
      [ngClass]="
        navService.navState() === 'msg' || navService.navState() === 'bookmark' ? 'justify-start' : 'justify-center'
      "
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
        <p class="font-medium text-sm text-primary">Profile</p>
      }
    </div>
  `,
})
export class FeedTabsComponent {
  navService = inject(NavigationService);

  notiButtons = ['all', 'mentions'];
  filterButtons = ['highlights', 'everyone'];

  changeFilterState(state: string, filterType: string) {
    if (filterType === 'home') {
      this.navService.filterState.update(() => state);
    } else if (filterType === 'notification') {
      this.navService.notificationFilterState.update(() => state);
    }
  }
}
