import { ChangeDetectionStrategy, Component, EventEmitter, Output, effect, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Model
import { NavButtonObj } from '@models/nav-button.model';

// Spartan-ng imports
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';

@Component({
  selector: 'App-nav-buttons',
  standalone: true,
  imports: [
    RouterLink,
    HlmButtonDirective,
    HlmDialogTitleDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogDescriptionDirective,
    HlmDialogComponent,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogContentComponent,
    BrnTooltipContentDirective,
    HlmTooltipTriggerDirective,
    HlmTooltipComponent,
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
