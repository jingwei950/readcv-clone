// Angular imports
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// 3rd party imports
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'App-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonDirective, RouterLink],
  template: `<button hlmBtn [routerLink]="routeTo()">Go to posts</button>`,
})
export class ButtonComponent {
  buttonText = input.required<string>();
  routeTo = input<string>();
}
