// Angular imports
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { JsonPipe } from '@angular/common';

// 3rd party imports
import { HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';

type VariantType = 'small' | 'medium' | 'large' | null | undefined;

@Component({
  selector: 'App-avatar',
  standalone: true,
  imports: [HlmAvatarImageDirective, HlmAvatarComponent, HlmAvatarFallbackDirective, JsonPipe],
  templateUrl: './avatar.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  avatarUrl = input<string | null>();
  name = input.required<string>();
  buttonVariant = input<VariantType>('medium');

  getShortName(fullName: string) {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
}
