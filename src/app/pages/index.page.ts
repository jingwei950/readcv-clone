import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { NavigationComponent } from '../shared/components/navigation/navigation.component';
import { PostFeedComponent } from '../shared/components/post-feed/post-feed.component';
import { JobListingsComponent } from '../shared/components/job-listings/job-listings.component';
import { ResponsiveBreakpointService } from '../shared/services/responsive-breakpoint.service';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './index.component.html',
  styles: [],
  imports: [
    NavigationComponent,
    PostFeedComponent,
    JobListingsComponent,
    ButtonComponent,
    RouterLink,
    AsyncPipe,
    NgClass,
  ],
})
export default class HomePageComponent {
  screenSize = inject(ResponsiveBreakpointService);
}
