// Angular imports
import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// Services
import { ResponsiveBreakpointService } from '../../services/responsive-breakpoint.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, AsyncPipe],
})
export class NavigationComponent {
  screenSize = inject(ResponsiveBreakpointService);
}
