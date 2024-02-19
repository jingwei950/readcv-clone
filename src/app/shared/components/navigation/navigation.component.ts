// Angular imports
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

// Services
import { ResponsiveBreakpointService } from '@services/responsive-breakpoint.service';
import { NavigationService } from '@services/navigation.service';
import { AuthService } from '@services/auth.service';

// Models
import { NavButton, NavButtonObj } from '@models/nav-button.model';

// Custom Icons
import homeIcon from '@svg/home-icon';
import searchIcon from '@svg/search-icon';
import bellIcon from '@svg/bell-icon';
import paperPlaneIcon from '@svg/paper-plane-icon';
import bookmarkIcon from '@svg/bookmark-icon';

// Components
import { NavButtonsComponent } from '@components/nav-buttons/nav-buttons.component';
import { AvatarComponent } from '@components/avatar/avatar.component';

// 3rd party imports
import { BrnTooltipContentDirective } from '@spartan-ng/ui-tooltip-brain';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';

@Component({
  selector: 'App-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    AsyncPipe,
    RouterLink,
    NavButtonsComponent,
    AvatarComponent,
    HlmTooltipComponent,
    HlmTooltipTriggerDirective,
    BrnTooltipContentDirective,
  ],
})
export class NavigationComponent {
  // Service
  public screenSize = inject(ResponsiveBreakpointService);
  public navService = inject(NavigationService);
  public authService = inject(AuthService);

  navigationState = this.navService.navState;
  currentUser = this.authService.auth_user;

  // Icons
  homeIcon: NavButton = homeIcon;
  searchIcon: NavButton = searchIcon;
  bellIcon: NavButton = bellIcon;
  paperPlaneIcon: NavButton = paperPlaneIcon;
  bookmarkIcon: NavButton = bookmarkIcon;

  iconArray: NavButtonObj[] = [
    { name: 'home', alias: 'home', path: '/', icon: this.homeIcon },
    { name: 'search', alias: 'search', path: '/search', icon: this.searchIcon },
    { name: 'notifications', alias: 'noti', path: '/notification', icon: this.bellIcon },
    { name: 'message', alias: 'msg', path: '/message', icon: this.paperPlaneIcon },
    { name: 'bookmark', alias: 'bookmark', path: '/bookmark', icon: this.bookmarkIcon },
  ];

  changeState(e: any) {
    this.navService.navState.set(e);
  }
}
