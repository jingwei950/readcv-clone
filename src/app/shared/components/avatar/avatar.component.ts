// Angular imports
import { ChangeDetectionStrategy, Component } from '@angular/core';

// 3rd party imports
import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '../../../../../spartan-ng-components/ui-avatar-helm/src';

@Component({
  selector: 'App-avatar',
  standalone: true,
  imports: [HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective],
  templateUrl: './avatar.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {}
