// Angular imports
import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, input, output } from '@angular/core';

// Model
import { NavButtonObj } from '@models/nav-button.model';

// Components
import { SvgIconComponent } from '@components/svg-icon/svg-icon.component';

// Spartan-ng imports
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
// import {
//   BrnDialogContentDirective,
//   BrnDialogTriggerDirective,
// } from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
// import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';
import { homeIcon } from '@components/svg-icon/icons';
import { NavigationService } from '@services/navigation.service';

@Component({
  selector: 'App-nav-buttons',
  standalone: true,
  imports: [
    RouterLink,
    SvgIconComponent,
    HlmButtonDirective,
    HlmDialogComponent,
    HlmTooltipComponent,
    // HlmDialogTitleDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogContentComponent,
    // BrnDialogContentDirective,
    // BrnDialogTriggerDirective,
    // BrnTooltipContentDirective,
    HlmTooltipTriggerDirective,
    // HlmDialogDescriptionDirective,
  ],
  template: `@if (icon().alias === 'search') {
      <hlm-dialog>
        <hlm-tooltip>
          <button position="right" brnDialogTrigger hlmTooltipTrigger aria-describedby="{{ icon().name }}">
            <App-svg-icon [icon]="icon().icon" icon_class="w-7 h-7 dark:fill-grey1" />
          </button>
          <span *brnTooltipContent class="capitalize">{{ icon().name }}</span>
        </hlm-tooltip>
        <hlm-dialog-content *brnDialogContent="let ctx">
          <hlm-dialog-header>
            <h3 brnDialogTitle hlm>Edit profile</h3>
            <p brnDialogDescription hlm>Make changes to your profile here. Click save when you're done.</p>
          </hlm-dialog-header>
          <hlm-dialog-footer>
            <button hlmBtn type="submit">Save changes</button>
          </hlm-dialog-footer>
        </hlm-dialog-content>
      </hlm-dialog>
    } @else {
      <hlm-tooltip>
        <button
          position="right"
          hlmTooltipTrigger
          aria-describedby="{{ icon().name }}"
          (click)="routeTo(icon().alias)"
          [routerLink]="icon().path"
        >
          <App-svg-icon [icon]="iconSelected() ? icon().iconSolid : icon().icon" icon_class="w-7 h-7" />
        </button>

        <span *brnTooltipContent class="capitalize">{{ icon().name }}</span>
      </hlm-tooltip>
    } `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavButtonsComponent {
  navService = inject(NavigationService);

  icon = input.required<NavButtonObj>();
  // icon = this.navService.iconState;
  iconType = input<string>();
  iconSelected = input<boolean>();

  onClick = output<string>();
  openDialog = output<void>();

  // @Output() onClick = new EventEmitter<string>();
  // @Output() openDialog = new EventEmitter();

  routeTo(route: string) {
    this.onClick.emit(route);
  }
}
