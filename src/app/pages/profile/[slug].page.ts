// Angular imports
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownComponent } from '@analogjs/content';
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

// Rxjs
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent, RouterLink],
  template: ` {{ profile$ | async }} profile `,
})
export default class ProfileComponent {
  private readonly route = inject(ActivatedRoute);

  readonly profile$ = this.route.paramMap.pipe(
    map((params) => params.get('slug')), //Must be the same "name" as the file name "[slug]"
  );
}
