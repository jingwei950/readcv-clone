import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'App-write-post-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <h3 brnDialogTitle hlm>Anyone can reply</h3>
    <textarea
      #textarea
      class="inline-flex flex-1 max-h-screen min-h-0 grow overflow-hidden resize-none outline-0 ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-96 w-full"
      type="text"
      placeholder="What's on your mind?"
    ></textarea>
  `,
})
export class WritePostCardComponent {}
