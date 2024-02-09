import { Component, OnInit, inject } from '@angular/core';
import { MarkdownComponent } from '@analogjs/content';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent, RouterLink],
  template: ` ID: {{ post$ | async }} `,
})
export default class PostComponent {
  private readonly route = inject(ActivatedRoute);

  readonly post$ = this.route.paramMap.pipe(
    map((params) => params.get('slug')) //Must be the same "name" as the file name "[slug]"
  );
}
