// Angular imports
import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

// Services
import { ResponsiveBreakpointService } from '../shared/services/responsive-breakpoint.service';

// Components
import { PostFeedComponent } from '../shared/components/post-feed/post-feed.component';
import { NavigationComponent } from '../shared/components/navigation/navigation.component';
import { JobListingsComponent } from '../shared/components/job-listings/job-listings.component';

@Component({
  standalone: true,
  templateUrl: './index.component.html',
  styles: [],
  imports: [NavigationComponent, PostFeedComponent, JobListingsComponent, RouterLink, AsyncPipe, NgClass],
})
export default class HomePageComponent {
  screenSize = inject(ResponsiveBreakpointService);
}
