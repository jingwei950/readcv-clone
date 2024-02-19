// Angular imports
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, inject, signal } from '@angular/core';

// Services
import { AuthService } from '@services/auth.service';

// Spartan-ng imports
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnDialogCloseDirective,
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

// Icons
import googleIcon from '@svg/google-icon';
import appleIcon from '@svg/apple-icon';

@Component({
  selector: 'App-job-listings',
  standalone: true,
  imports: [
    HlmButtonDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    HlmInputDirective,
    BrnDialogCloseDirective,
  ],
  templateUrl: './job-listings.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobListingsComponent {
  // Service
  authService = inject(AuthService);

  // HTML element reference
  @ViewChild('page1') page1?: ElementRef;
  @ViewChild('page2') page2?: ElementRef;
  @ViewChild('closeDialog') closeDialog?: ElementRef;

  // Icons
  googleIcon = googleIcon;
  appleIcon = appleIcon;

  // Slide number
  slideNum = signal(1);

  // Shorthand services
  currentUser = this.authService.auth_user;
  googleAuth = () => this.authService.googleAuth();
  sendEmailLinkAuth = (email: string) => {
    this.authService.sendEmailLinkAuth(email);
  };

  constructor() {
    effect(
      () => {
        console.log(this.authService.auth_user());

        // Close dialog after user logged in
        if (this.authService.auth_user()) {
          this.triggerClick();
        }
      },
      { allowSignalWrites: true },
    );
  }

  // Change slide animation
  changeSlide(currentSlide: number) {
    if (currentSlide === 1) {
      this.slideNum.set(2);
      this.page1?.nativeElement.classList.remove('translate-x-0');
      this.page1?.nativeElement.classList.add('-translate-x-full');
      this.page2?.nativeElement.classList.remove('translate-x-full');
      this.page2?.nativeElement.classList.add('translate-x-0');
    } else if (currentSlide === 2) {
      this.slideNum.set(1);
      this.page2?.nativeElement.classList.remove('translate-x-0');
      this.page2?.nativeElement.classList.add('translate-x-full');
      this.page1?.nativeElement.classList.remove('translate-x-full');
      this.page1?.nativeElement.classList.add('translate-x-0');
    }
  }

  triggerClick() {
    this.closeDialog?.nativeElement.click();
  }
}
