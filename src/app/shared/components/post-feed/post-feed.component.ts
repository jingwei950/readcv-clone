import {
  effect,
  inject,
  Component,
  ViewChild,
  ElementRef,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Post } from '@models/post.model';
import { FeedService } from '@services/feed.service';
import { AuthService } from '@services/auth.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { NavigationService } from '@services/navigation.service';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { PostCardComponent } from '@components/post-card/post-card.component';
import { ResponsiveBreakpointService } from '@services/responsive-breakpoint.service';

@Component({
  selector: 'App-post-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, AvatarComponent, PostCardComponent, HlmButtonDirective],
  template: `
    <div class="inline-flex justify-center w-full border-x border-gray-400 min-h-screen">
      <div class="flex flex-col w-full">
        <div
          class="flex w-full border-b border-gray-400 items-center min-h-16 px-6 sticky top-0 bg-background z-50"
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
          }
        </div>
        @if (currentUser()) {
          <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-400 min-h-32">
            <App-avatar buttonVariant="large" name="jingwei" [avatarUrl]="currentUser()?.photoURL" />
            <textarea
              #textarea
              type="text"
              class="flex-1 !ring-0 w-full px-4 py-2 !outline-none resize-none h-fit min-h-fit"
              placeholder="What's on your mind..."
            ></textarea>
          </div>
        }
        @switch (navService.navState()) {
          @case ('home') {
            @if (navService.filterState() === 'highlights') {
              @for (post of allPosts(); track $index) {
                @if (post) {
                  <App-post-card [post]="post" />
                }
              }
            } @else {
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

  @ViewChild('textarea') textareaRef?: ElementRef;

  notiButtons = ['all', 'mentions'];
  filterButtons = ['highlights', 'everyone'];

  allPosts: WritableSignal<Post[]> = this.feedService.allPosts;
  currentUser = this.authService.auth_user;

  constructor() {
    effect(() => {
      this.textareaRef?.nativeElement.addEventListener('input', () => {
        this.textareaRef!.nativeElement.style.height = 'auto';
        this.textareaRef!.nativeElement.style.minHeight = `${this.textareaRef!.nativeElement.scrollHeight}px`;
      });
    });
  }

  changeFilterState(state: string, filterType: string) {
    if (filterType === 'home') {
      this.navService.filterState.update(() => state);
    } else if (filterType === 'notification') {
      this.navService.notificationFilterState.update(() => state);
    }
  }
}
