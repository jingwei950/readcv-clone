// Angular imports
import { Component, inject, OnInit } from '@angular/core';
import { RouteMeta } from '@analogjs/router';
import { NavigationService } from '@services/navigation.service';

export const routeMeta: RouteMeta = {
  title: 'Bookmarks',
};

@Component({
  standalone: true,
  imports: [],
  template: `
    <div class="p-4">
      <p>Bookmarks</p>
    </div>
  `,
})
export default class BookmarkPageComponent implements OnInit {
  navService = inject(NavigationService);

  ngOnInit() {
    // Set navigation state to bookmark
    this.navService.updateNavState('bookmark');
  }
}
