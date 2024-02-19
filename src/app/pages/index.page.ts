// Angular imports
import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

// Services
import { ResponsiveBreakpointService } from '@services/responsive-breakpoint.service';

// Components
import { PostFeedComponent } from '@components/post-feed/post-feed.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { JobListingsComponent } from '@components/job-listings/job-listings.component';

@Component({
  standalone: true,
  templateUrl: './index.component.html',
  styles: [],
  imports: [NavigationComponent, PostFeedComponent, JobListingsComponent, RouterLink, AsyncPipe, NgClass],
})
export default class HomePageComponent {
  screenSize = inject(ResponsiveBreakpointService);
}
