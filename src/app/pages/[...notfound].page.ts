// Angular imports
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// 3rd party imports
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  standalone: true,
  imports: [RouterLink, HlmButtonDirective],
  template: `
    <h2>Page Not Found</h2>

    <button hlmBtn routerLink="/">Go Back Home</button>
  `,
})
export default class PageNotFoundComponent {}
