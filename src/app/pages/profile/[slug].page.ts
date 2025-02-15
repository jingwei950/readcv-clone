// Angular imports
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';

// Rxjs
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [AsyncPipe],
  template: ` {{ profile$ | async }} profile `,
})
export default class ProfileComponent {
  private readonly route = inject(ActivatedRoute);

  readonly profile$ = this.route.paramMap.pipe(
    map((params) => params.get('slug')), //Must be the same "name" as the file name "[slug]"
  );
}
