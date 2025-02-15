import { FeedService } from '@services/feed.service';
import { AuthService } from '@services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationService } from '@services/navigation.service';
import { FeedTabsComponent } from '../feed-tabs/feed-tabs.component';
import { PostCardComponent } from '@components/post-card/post-card.component';
import { PostComposerComponent } from '../post-composer/post-composer.component';
import { ResponsiveBreakpointService } from '@services/responsive-breakpoint.service';
import { effect, inject, Component, viewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'App-post-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostCardComponent, FeedTabsComponent, PostComposerComponent],
  template: `
    <div class="inline-flex justify-center w-full border-x border-gray-300 dark:border-primaryBorderColor min-h-screen">
      <div class="flex flex-col w-full">
        <App-feed-tabs />

        @if (currentUser()) {
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
          @default {
            <!-- <App-post-card /> -->
          }
        }
      </div>
    </div>
  `,
})
export class PostFeedComponent {
  feedService = inject(FeedService);
  authService = inject(AuthService);
  navService = inject(NavigationService);
  screenSize = inject(ResponsiveBreakpointService);

  textareaRef = viewChild(ElementRef);

  allPosts = toSignal(this.feedService.getAllPosts$, { initialValue: [] });
  currentUser = this.authService.auth_user;
  userEnrichedPost = toSignal(this.feedService.userEnrichedPost$, { initialValue: [] });

  constructor() {
    effect(() => {
      this.textareaRef()?.nativeElement.addEventListener('input', () => {
        this.textareaRef()!.nativeElement.style.height = 'auto';
        this.textareaRef()!.nativeElement.style.minHeight = `${this.textareaRef()!.nativeElement.scrollHeight}px`;
      });

      console.log(this.userEnrichedPost());
    });
  }
}
