import { Component } from '@angular/core';
import { ButtonComponent } from '../shared/components/button/button.component';
import { RouterLink } from '@angular/router';
import { NavigationComponent } from '../shared/components/navigation/navigation.component';
import { PostFeedComponent } from '../shared/components/post-feed/post-feed.component';
import { JobListingsComponent } from '../shared/components/job-listings/job-listings.component';
import { AvatarComponent } from '../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './index.component.html',
  styles: [],
  imports: [
    NavigationComponent,
    PostFeedComponent,
    JobListingsComponent,
    ButtonComponent,
    RouterLink,
  ],
})
export default class HomeComponent {}
