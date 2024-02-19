import { Directive, inject } from '@angular/core';
import { HlmIconComponent } from 'src/app/shared/spartan-ng-components/ui-icon-helm/src';

@Directive({
  selector: '[hlmAlertIcon]',
  standalone: true,
})
export class HlmAlertIconDirective {
  private _icon = inject(HlmIconComponent, { host: true, optional: true });

  constructor() {
    if (!this._icon) return;
    this._icon.size = 'sm';
  }
}
