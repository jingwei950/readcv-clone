import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HlmButtonDirective } from '../../../../../spartan-ng-components/ui-button-helm/src';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '../../../../../spartan-ng-components/ui-dialog-helm/src';

@Component({
  selector: 'App-nav-buttons',
  standalone: true,
  imports: [
    RouterLink,
    HlmButtonDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
  ],
  templateUrl: './nav-buttons.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavButtonsComponent {
  iconRoute = input.required<string>();
  iconAlias = input.required<string>();
  icon = input.required<string>();

  @Output() onClick = new EventEmitter<string>();
  @Output() openDialog = new EventEmitter();

  routeTo(route: string) {
    this.onClick.emit(route);
  }
}
