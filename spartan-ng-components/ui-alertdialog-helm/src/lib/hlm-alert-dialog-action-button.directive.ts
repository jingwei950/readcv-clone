import { Directive } from '@angular/core';
import { HlmButtonDirective } from '../../../ui-button-helm/src';

@Directive({
  selector: 'button[hlmAlertDialogAction]',
  standalone: true,
  hostDirectives: [HlmButtonDirective],
})
export class HlmAlertDialogActionButtonDirective {}
