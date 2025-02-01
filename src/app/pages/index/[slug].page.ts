// Angular imports
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

// Rxjs
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [AsyncPipe],
  template: ` ID: {{ post$ | async }} `,
})
export default class PostComponent {
  private readonly route = inject(ActivatedRoute);

  readonly post$ = this.route.paramMap.pipe(
    map((params) => params.get('slug')) //Must be the same "name" as the file name "[slug]"
  );
}
