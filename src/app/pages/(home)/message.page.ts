// Angular imports
import { Component, inject, OnInit } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { NavigationService } from '@services/navigation.service';

export const routeMeta: RouteMeta = {
  title: 'Messages',
};

@Component({
  standalone: true,
  imports: [],
  template: `
    <div class="p-4">
      <p>Message</p>
    </div>
  `,
})
export default class MessagePageComponent implements OnInit {
  navService = inject(NavigationService);

  ngOnInit() {
    // Set navigation state to message
    this.navService.updateNavState('msg');
  }
}
