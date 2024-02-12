// Angular imports
import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// Services
import { ResponsiveBreakpointService } from '../../services/responsive-breakpoint.service';
import { NavigationService } from '../../services/navigation.service';

// Models
import { NavButton, NavButtonObj } from '../../models/nav-button.model';

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
