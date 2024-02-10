// Angular imports
import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// Services
import { ResponsiveBreakpointService } from '../../services/responsive-breakpoint.service';
import { NavigationService } from '../../services/navigation.service';

// Models
import { NavButton } from '../../models/nav-button.model';

// Custom Icons
import homeIcon from '../../../../assets/SVG/home-icon';
import searchIcon from '../../../../assets/SVG/search-icon';
import bellIcon from '../../../../assets/SVG/bell-icon';
import paperPlaneIcon from '../../../../assets/SVG/paper-plane-icon';
import bookmarkIcon from '../../../../assets/SVG/bookmark-icon';

// Components
import { NavButtonsComponent } from '../nav-buttons/nav-buttons.component';

@Component({
  selector: 'App-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, AsyncPipe, NavButtonsComponent],
})
export class NavigationComponent {
  // Service
  public screenSize = inject(ResponsiveBreakpointService);
  public navService = inject(NavigationService);

  navigationState = this.navService.navState;

  // Icons
  homeIcon: NavButton = homeIcon;
  searchIcon: NavButton = searchIcon;
  bellIcon: NavButton = bellIcon;
  paperPlaneIcon: NavButton = paperPlaneIcon;
  bookmarkIcon: NavButton = bookmarkIcon;

  iconArray = [
    { alias: 'home', path: '/', icon: homeIcon },
    { alias: 'search', path: '/search', icon: searchIcon },
    { alias: 'noti', path: '/notification', icon: bellIcon },
    { alias: 'msg', path: '/message', icon: paperPlaneIcon },
    { alias: 'bookmark', path: '/bookmark', icon: bookmarkIcon },
  ];

  changeState(e: any) {
    this.navService.navState.set(e);
  }
}
