// Angular imports
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// 3rd party imports
import { HlmButtonDirective } from 'src/app/shared/spartan-ng-components/ui-button-helm/src';

@Component({
  standalone: true,
  imports: [RouterLink, HlmButtonDirective],
  template: `
    <h2>Page Not Found</h2>

    <button hlmBtn routerLink="/">Go Back Home</button>
  `,
})
export default class PageNotFoundComponent {}
