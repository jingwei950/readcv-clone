// Angular imports
import { Component, inject, OnInit } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { NavigationService } from '@services/navigation.service';

export const routeMeta: RouteMeta = {
  title: 'Search',
};

@Component({
  standalone: true,
  imports: [],
  template: `
    <div class="p-4">
      <p>Search</p>
    </div>
  `,
})
export default class SearchPageComponent implements OnInit {
  navService = inject(NavigationService);

  ngOnInit() {
    // Set navigation state to search
    this.navService.updateNavState('search');
  }
}
