// Angular imports
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

// Components
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'App-post-card',
  standalone: true,
  templateUrl: './post-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent],
})
export class PostCardComponent {
  name = signal('Jingwei');
  username = signal('jingwei950');
  timestamp = signal('13h');
}
