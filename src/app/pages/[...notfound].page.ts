// Angular imports
import { RouteMeta } from '@analogjs/router';
import { injectResponse } from '@analogjs/router/tokens';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// 3rd party imports
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

export const routeMeta: RouteMeta = {
  title: 'Page Not Found',
  canActivate: [
    () => {
      const response = injectResponse();
      if (import.meta.env.SSR && response) {
        console.log('Page Not Found');
        response.statusCode = 404;
        response.end();
      }
      return true;
    },
  ],
};

@Component({
  standalone: true,
  imports: [RouterLink, HlmButtonDirective],
  template: `
    <h2>Page Not Found</h2>

    <button hlmBtn routerLink="/">Go Back Home</button>
  `,
})
export default class PageNotFoundComponent {}
