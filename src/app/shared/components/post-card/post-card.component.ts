// Angular imports
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

// Components
import { AvatarComponent } from '../avatar/avatar.component';

// Models
import { PostButton, PostButtonObj } from '../../models/nav-button.model';

// Icons
import commentIcon from '../../../../assets/SVG/comment-icon';
import repostIcon from '../../../../assets/SVG/repost-icon';
import heartIcon from '../../../../assets/SVG/heart-icon';
import ellipsisIcon from '../../../../assets/SVG/ellipsis-icon';

// Spartan-ng imports
import { HlmButtonDirective } from '../../../../../spartan-ng-components/ui-button-helm/src';

@Component({
  selector: 'App-post-card',
  standalone: true,
  templateUrl: './post-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, HlmButtonDirective],
})
export class PostCardComponent {
  name = signal('Jingwei');
  username = signal('jingwei950');
  timestamp = signal('13h');

  // Icons
  commentIcon: PostButton = commentIcon;
  repostIcon: PostButton = repostIcon;
  heartIcon: PostButton = heartIcon;
  ellipsisIcon: PostButton = ellipsisIcon;

  // Post buttons
  postIcons: PostButtonObj[] = [
    { name: 'comment', alias: 'comment', path: '', icon: this.commentIcon },
    { name: 'repost', alias: 'repost', icon: this.repostIcon },
    { name: 'like', alias: 'like', icon: this.heartIcon },
  ];
}
