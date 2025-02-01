// Angular imports
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { JsonPipe } from '@angular/common';

// 3rd party imports
import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '@spartan-ng/ui-avatar-helm';

type VariantType = 'small' | 'medium' | 'large' | null | undefined;

@Component({
  selector: 'App-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    HlmAvatarComponent,
    HlmAvatarImageDirective,
    HlmAvatarFallbackDirective,
  ],
  template: `
    <hlm-avatar [variant]="buttonVariant()">
      {{ avatarUrl() | json }}
      <img
        referrerpolicy="no-referrer"
        [src]="avatarUrl()"
        alt=""
        hlmAvatarImage
      />
      <span class="bg-[#FD005B] text-white" hlmAvatarFallback>{{
        getShortName(name())
      }}</span>
    </hlm-avatar>
  `,
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
