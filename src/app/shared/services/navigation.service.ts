import {
  homeIcon,
  bellIcon,
  searchIcon,
  bookmarkIcon,
  bellIconSolid,
  homeIconSolid,
  paperPlaneIcon,
  searchIconSolid,
  bookmarkIconSolid,
  paperPlaneIconSolid,
} from '@components/svg-icon/icons';
import { Injectable, signal } from '@angular/core';
import { NavButtonObj } from '@models/nav-button.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  homeIcon: string = homeIcon;
  bellIcon: string = bellIcon;
  searchIcon: string = searchIcon;
  bookmarkIcon: string = bookmarkIcon;
  paperPlaneIcon: string = paperPlaneIcon;

  homeIconSolid: string = homeIconSolid;
  bellIconSolid: string = bellIconSolid;
  searchIconSolid: string = searchIconSolid;
  bookmarkIconSolid: string = bookmarkIconSolid;
  paperPlaneIconSolid: string = paperPlaneIconSolid;

  navState = signal<string>('home');
  previousNavState = signal<string>('home');

  iconState = signal<NavButtonObj[]>([
    {
      name: 'home',
      alias: 'home',
      path: '/',
      icon: this.homeIcon,
      iconSolid: this.homeIconSolid,
      iconSelected: true,
    },
    {
      name: 'search',
      alias: 'search',
      path: '/search',
      icon: this.searchIcon,
      iconSolid: this.searchIconSolid,
      iconSelected: false,
    },
    {
      name: 'notifications',
      alias: 'noti',
      path: '/notification',
      icon: this.bellIcon,
      iconSolid: this.bellIconSolid,
      iconSelected: false,
    },
    {
      name: 'message',
      alias: 'msg',
      path: '/message',
      icon: this.paperPlaneIcon,
      iconSolid: this.paperPlaneIconSolid,
      iconSelected: false,
    },
    {
      name: 'bookmark',
      alias: 'bookmark',
      path: '/bookmark',
      icon: this.bookmarkIcon,
      iconSolid: this.bookmarkIconSolid,
      iconSelected: false,
    },
    {
      name: 'profile',
      alias: 'profile',
      path: '/profile',
      iconSelected: false,
    },
  ]);
  filterState = signal<string>('highlights');
  notificationFilterState = signal<string>('all');

  updateNavState(newState: string): void {
    if (this.navState() !== 'profile' && newState === 'profile') {
      this.previousNavState.set(this.navState());
    }
    this.navState.set(newState);

    this.updateIconSelectedState(newState);
  }

  updateIconSelectedState(selectedState: string): void {
    this.iconState.update((icons) =>
      icons.map((icon) => ({
        ...icon,
        iconSelected: icon.alias === selectedState,
      })),
    );
  }

  getPreviousStatePath(): string {
    const prevState = this.previousNavState();
    const navItem = this.iconState().find((item) => item.alias === prevState);
    return navItem?.path || '/';
  }
}
