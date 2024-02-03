import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  templateUrl: './post-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent],
})
export class PostCardComponent {}
