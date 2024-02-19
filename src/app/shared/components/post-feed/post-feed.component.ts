// Angular imports
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  WritableSignal,
  effect,
  inject,
} from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

// Services
import { ResponsiveBreakpointService } from '@services/responsive-breakpoint.service';
import { NavigationService } from '@services/navigation.service';
import { FeedService } from '@services/feed.service';
import { AuthService } from '@services/auth.service';

// Model
import { Post } from '@models/post.model';

// 3rd party imports
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

// Components
import { PostCardComponent } from '@components/post-card/post-card.component';
import { AvatarComponent } from '@components/avatar/avatar.component';

@Component({
  selector: 'App-post-feed',
  standalone: true,
  templateUrl: './post-feed.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, AsyncPipe, RouterLink, PostCardComponent, AvatarComponent, HlmButtonDirective, HlmInputDirective],
})
export class PostFeedComponent {
  screenSize = inject(ResponsiveBreakpointService);
  navService = inject(NavigationService);
  feedService = inject(FeedService);
  authService = inject(AuthService);

  @ViewChild('textarea') textareaRef?: ElementRef;

  filterButtons = ['highlights', 'everyone'];
  notiButtons = ['all', 'mentions'];

  allPosts: WritableSignal<Post[]> = this.feedService.allPosts;
  currentUser = this.authService.auth_user;

  constructor() {
    effect(() => {
      console.log(this.allPosts());
    });

    effect(() => {
      this.textareaRef?.nativeElement.addEventListener('input', () => {
        this.textareaRef!.nativeElement.style.height = 'auto';
        this.textareaRef!.nativeElement.style.minHeight = `${this.textareaRef!.nativeElement.scrollHeight}px`;
      });

      console.log(this.textareaRef?.nativeElement.style.height);
    });
  }

  ngAfterViewInit() {}

  changeFilterState(state: string, filterType: string) {
    if (filterType === 'home') {
      this.navService.filterState.update(() => state);
    } else if (filterType === 'notification') {
      this.navService.notificationFilterState.update(() => state);
    }
  }
}
