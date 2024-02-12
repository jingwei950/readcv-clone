// Angular imports
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

// Service
import { ResponsiveBreakpointService } from '../../services/responsive-breakpoint.service';

// 3rd party imports
import { HlmButtonDirective } from '../../../../../spartan-ng-components/ui-button-helm/src';

// Components
import { PostCardComponent } from '../post-card/post-card.component';
import { NavigationService } from '../../services/navigation.service';
import { FeedService } from '../../services/feed.service';

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

  highlightFeed = this.feedService.highlightFeed;

  filterButtons = ['highlights', 'everyone'];
  notiButtons = ['all', 'mentions'];

  changeFilterState(state: string, filterType: string) {
    if (filterType === 'home') {
      this.navService.filterState.update(() => state);
    } else if (filterType === 'notification') {
      this.navService.notificationFilterState.update(() => state);
    }
  }
}
