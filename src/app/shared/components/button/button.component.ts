import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmButtonDirective } from '../../../../../spartan-ng-components/ui-button-helm/src';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
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
