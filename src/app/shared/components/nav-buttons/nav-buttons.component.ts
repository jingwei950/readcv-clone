// Angular imports
import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

// Model
import { NavButtonObj } from '@models/nav-button.model';

// Components
import { SvgIconComponent } from '@components/svg-icon/svg-icon.component';

// Services
import { NavigationService } from '@services/navigation.service';
import { UserService } from '@services/user.service';

// Spartan-ng imports
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmDialogComponent,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogContentComponent,
} from '@spartan-ng/ui-dialog-helm';
import { BrnTooltipContentDirective } from '@spartan-ng/brain/tooltip';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';
import {
  BrnDialogContentDirective,
  BrnDialogDescriptionDirective,
  BrnDialogTitleDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';
import { AuthService } from '@services/auth.service';
import { imageIcon, plusIcon } from '@components/svg-icon/icons';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'App-nav-buttons',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    FormsModule,
    AvatarComponent,
    SvgIconComponent,
    HlmButtonDirective,
    HlmDialogComponent,
    HlmTooltipComponent,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogContentComponent,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    BrnTooltipContentDirective,
    HlmTooltipTriggerDirective,
    BrnDialogTitleDirective,
    BrnDialogDescriptionDirective,
  ],
  template: `
    @if (icon().alias === 'search') {
      <hlm-dialog>
        <hlm-tooltip>
          <button position="right" brnDialogTrigger hlmTooltipTrigger aria-describedby="{{ icon().name || '' }}">
            <App-svg-icon [icon]="icon().icon ?? ''" icon_class="w-7 h-7 dark:fill-grey1" />
          </button>
          <span *brnTooltipContent class="capitalize">{{ icon().name }}</span>
        </hlm-tooltip>
        <hlm-dialog-content *brnDialogContent="let ctx">
          <hlm-dialog-header>
            <h3 brnDialogTitle class="dark:text-grey1">Edit profile</h3>
            <p brnDialogDescription>Make changes to your profile here. Click save when you're done.</p>
          </hlm-dialog-header>
          <hlm-dialog-footer>
            <button hlmBtn type="submit">Save changes</button>
          </hlm-dialog-footer>
        </hlm-dialog-content>
      </hlm-dialog>
    } @else if (icon().alias === 'profile' && currentUser()) {
      <hlm-tooltip>
        <button
          position="right"
          brnDialogTrigger
          hlmTooltipTrigger
          aria-describedby="profile"
          class="w-16 h-16 inline-flex items-center justify-center ml-auto"
          (click)="routeTo(icon().alias)"
          [routerLink]="appUser()?.username ? ['/', appUser()!.username] : ['/profile']"
        >
          <App-avatar
            buttonVariant="small"
            [name]="currentUser()?.displayName!"
            [avatarUrl]="currentUser()?.photoURL"
          />
        </button>
        <span *brnTooltipContent class="capitalize">profile</span>
      </hlm-tooltip>
    } @else {
      <hlm-tooltip>
        <button
          position="right"
          hlmTooltipTrigger
          aria-describedby="{{ icon().name }}"
          (click)="routeTo(icon().alias)"
          [routerLink]="icon().path"
        >
          <App-svg-icon [icon]="iconSelected() ? (icon().iconSolid ?? '') : (icon().icon ?? '')" icon_class="w-7 h-7" />
        </button>

        <span *brnTooltipContent class="capitalize">{{ icon().name }}</span>
      </hlm-tooltip>
    }
  `,
})
export class NavButtonsComponent {
  authService = inject(AuthService);
  navService = inject(NavigationService);
  userService = inject(UserService);

  currentUser = this.authService.auth_user;
  appUser = toSignal(this.userService.current_user$);

  iconType = input<string>();
  iconSelected = input<boolean>();
  icon = input.required<NavButtonObj>();

  onClick = output<string>();
  openDialog = output<void>();

  protected readonly plusIcon = plusIcon;
  protected readonly imageIcon = imageIcon;

  routeTo(route: string) {
    this.onClick.emit(route);
  }
}
