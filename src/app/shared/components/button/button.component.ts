// Angular imports
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// 3rd party imports
import { HlmButtonDirective } from '../../../../../spartan-ng-components/ui-button-helm/src';

@Component({
  selector: 'App-button',
  standalone: true,
  templateUrl: './button.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonDirective, RouterLink],
})
export class ButtonComponent {
  buttonText = input.required<string>();
  routeTo = input<string>();
}
