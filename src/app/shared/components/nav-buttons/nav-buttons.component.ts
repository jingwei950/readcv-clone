import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Spartan-ng imports
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
import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import {
  HlmTooltipComponent,
  HlmTooltipTriggerDirective,
} from '../../../../../spartan-ng-components/ui-tooltip-helm/src';
import { NavButtonObj } from '../../models/nav-button.model';

@Component({
  selector: 'App-nav-buttons',
  standalone: true,
  imports: [
    RouterLink,
    HlmButtonDirective,
    HlmDialogTitleDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    BrnTooltipContentDirective,
    HlmTooltipTriggerDirective,
    HlmDialogDescriptionDirective,
    HlmDialogComponent,
    HlmTooltipComponent,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogContentComponent,
  ],
  templateUrl: './nav-buttons.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavButtonsComponent {
  icon = input.required<NavButtonObj>();
  iconType = input.required<string>();

  @Output() onClick = new EventEmitter<string>();
  @Output() openDialog = new EventEmitter();

  routeTo(route: string) {
    this.onClick.emit(route);
  }
}
