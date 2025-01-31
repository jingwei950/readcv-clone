import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  hlmBlockquote,
  hlmH1,
  hlmH2,
  hlmH3,
  hlmLead,
  hlmP,
  hlmUl,
} from '@spartan-ng/ui-typography-helm';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HlmButtonDirective],
  template: `
    <button hlmBtn>Button</button>

    <p class="${hlmP} mt-4">
      Once upon a time, in a far-off land, there was a very lazy king who spent
      all day lounging on his throne. One day, his advisors came to him with a
      problem: the kingdom was running out of money.
    </p>
  `,
})
export default class HomeComponent {}
