import {
  effect,
  inject,
  Component,
  viewChild,
  ElementRef,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Post } from '@models/post.model';
import { FeedService } from '@services/feed.service';
import { AuthService } from '@services/auth.service';
import { NavigationService } from '@services/navigation.service';
import { FeedTabsComponent } from '../feed-tabs/feed-tabs.component';
import { PostCardComponent } from '@components/post-card/post-card.component';
import { ResponsiveBreakpointService } from '@services/responsive-breakpoint.service';
import { PostComposerComponent } from '../post-composer/post-composer.component';

@Component({
  selector: 'App-post-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostCardComponent, FeedTabsComponent, PostComposerComponent],
  template: `
    <div class="inline-flex justify-center w-full border-x border-gray-400 min-h-screen">
      <div class="flex flex-col w-full">
        <App-feed-tabs />

        @if (currentUser()) {
          <App-post-composer [currentUser]="currentUser()!" />
        }

        @switch (navService.navState()) {
          @case ('home') {
            @if (navService.filterState() === 'highlights' && allPosts().length > 0) {
              @for (post of allPosts(); track $index) {
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

  allPosts: WritableSignal<Post[]> = this.feedService.allPosts;
  currentUser = this.authService.auth_user;

  constructor() {
    effect(() => {
      this.textareaRef()?.nativeElement.addEventListener('input', () => {
        this.textareaRef()!.nativeElement.style.height = 'auto';
        this.textareaRef()!.nativeElement.style.minHeight = `${this.textareaRef()!.nativeElement.scrollHeight}px`;
      });
    });
  }
}
