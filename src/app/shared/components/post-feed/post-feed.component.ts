import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { HlmButtonDirective } from '../../../../../spartan-ng-components/ui-button-helm/src';
import { ResponsiveBreakpointService } from '../../services/responsive-breakpoint.service';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  templateUrl: './post-feed.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, AsyncPipe, PostCardComponent, HlmButtonDirective],
})
export class PostFeedComponent {
  screenSize = inject(ResponsiveBreakpointService);
}
