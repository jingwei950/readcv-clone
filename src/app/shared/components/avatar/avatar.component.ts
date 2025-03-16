// Angular imports
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { JsonPipe } from '@angular/common';

// 3rd party imports
import { HlmAvatarComponent, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';

type VariantType = 'small' | 'medium' | 'large' | null | undefined;

@Component({
  selector: 'App-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, HlmAvatarComponent, HlmAvatarImageDirective],
  template: `
    <hlm-avatar [variant]="buttonVariant()">
      {{ avatarUrl() | json }}
      <img referrerpolicy="no-referrer" [src]="avatarUrl()" alt="" hlmAvatarImage />
    </hlm-avatar>
  `,
})
export class AvatarComponent {
  avatarUrl = input<string | null>();
  name = input.required<string>();
  buttonVariant = input<VariantType>('medium');
}
