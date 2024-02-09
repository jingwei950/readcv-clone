// Angular imports
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

// Service
import { ResponsiveBreakpointService } from '../../services/responsive-breakpoint.service';

// 3rd party imports
import { HlmButtonDirective } from '../../../../../spartan-ng-components/ui-button-helm/src';

// Components
import { PostCardComponent } from '../post-card/post-card.component';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  templateUrl: './post-feed.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, AsyncPipe, RouterLink, PostCardComponent, HlmButtonDirective],
})
export class PostFeedComponent {
  screenSize = inject(ResponsiveBreakpointService);
}
