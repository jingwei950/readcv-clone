// Angular imports
import { Component, inject, OnInit } from '@angular/core';
import { RouteMeta } from '@analogjs/router';

// Services
import { NavigationService } from '@services/navigation.service';

export const routeMeta: RouteMeta = {
  title: 'Notifications',
};

@Component({
  standalone: true,
  imports: [],
  template: `
    @if (navService.notificationFilterState() === 'all') {
      <div class="p-4">
        <p>All Notifications</p>
      </div>
    } @else {
      <div class="p-4">
        <p>Mentions</p>
      </div>
    }
  `,
})
export default class NotificationPageComponent implements OnInit {
  navService = inject(NavigationService);

  ngOnInit() {
    // Set navigation state to notification
    this.navService.updateNavState('noti');
  }
}
