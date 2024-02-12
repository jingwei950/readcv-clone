// Angular imports
import { ChangeDetectionStrategy, Component, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

// Services
import { ResponsiveBreakpointService } from '../../services/responsive-breakpoint.service';
import { NavigationService } from '../../services/navigation.service';
import { FeedService } from '../../services/feed.service';

// Model
import { Post } from '../../models/post.model';

// 3rd party imports
import { HlmButtonDirective } from '../../../../../spartan-ng-components/ui-button-helm/src';

// Components
import { PostCardComponent } from '../post-card/post-card.component';

@Component({
  selector: 'App-post-feed',
  standalone: true,
  templateUrl: './post-feed.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, AsyncPipe, RouterLink, PostCardComponent, HlmButtonDirective],
})
export class PostFeedComponent {
  screenSize = inject(ResponsiveBreakpointService);
  navService = inject(NavigationService);
  feedService = inject(FeedService);

  // highlightFeed = this.feedService.highlightFeed;

  filterButtons = ['highlights', 'everyone'];
  notiButtons = ['all', 'mentions'];

  allPosts: WritableSignal<Post[]> = this.feedService.allPosts;

  constructor() {
    effect(() => {
      console.log(this.allPosts());
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
