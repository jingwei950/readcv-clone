// Angular imports
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'App-job-listings',
  standalone: true,
  imports: [],
  templateUrl: './job-listings.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobListingsComponent {}
