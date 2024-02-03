import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PostCardComponent } from '../post-card/post-card.component';
import { HlmButtonDirective } from '../../../../../spartan-ng-components/ui-button-helm/src';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  templateUrl: './post-feed.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostCardComponent, HlmButtonDirective],
})
export class PostFeedComponent {}
