// Angular imports
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';

// Rxjs
import { map, tap } from 'rxjs';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';

@Component({
  standalone: true,
  imports: [],
  template: `
    <div class="flex w-full">
      <!-- Side Navbar -->
      <div>
        <!-- <button position="right" brnDialogTrigger hlmTooltipTrigger aria-describedby="{{ icon().name }}">
          <App-svg-icon [icon]="icon().icon" icon_class="w-7 h-7 dark:fill-grey1" />
        </button> -->
      </div>

      <!-- Main content -->
      <main></main>
    </div>
  `,
})
export default class PortfolioComponent {
  private readonly route = inject(ActivatedRoute);

  readonly profile$ = this.route.paramMap.pipe(
    map((params) => params.get('slug')), //Must be the same "name" as the file name "[slug]"
  );
}
