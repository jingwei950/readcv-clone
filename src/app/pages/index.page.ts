// Angular imports
import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Services
import { UserService } from '@services/user.service';
import { AuthService } from '@services/auth.service';
import { DialogStateService } from '@services/dialog-state.service';
import { ResponsiveBreakpointService } from '@services/responsive-breakpoint.service';

// Components
import { PostFeedComponent } from '@components/post-feed/post-feed.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { JobListingsComponent } from '@components/job-listings/job-listings.component';

import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
  BrnDialogCloseDirective,
} from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogTitleDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgClass,
    AsyncPipe,
    PostFeedComponent,
    HlmInputDirective,
    HlmDialogComponent,
    HlmButtonDirective,
    ReactiveFormsModule,
    NavigationComponent,
    JobListingsComponent,
    BrnDialogCloseDirective,
    HlmDialogTitleDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogContentComponent,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogDescriptionDirective,
  ],
  template: `<div class="w-full h-screen">
    <main
      class="flex justify-center mx-auto w-full max-w-[calc(300px+604px+300px)]"
    >
      <!-- Navigation -->
      @if (!(screenSize.isHandset$ | async)) {
      <App-navigation class="flex-1" />
      }

      <!-- Posts section -->
      <div class="min-w-[420px] lg:max-w-[600px] w-full">
        <App-post-feed />
      </div>

      <!-- Job listings -->
      @if (screenSize.isWeb$ | async) {
      <div class="max-w-[300px] max-h-screen h-auto w-full sticky top-0">
        <App-job-listings />
      </div>
      }

      <hlm-dialog>
        <button class="hidden" brnDialogTrigger hlmBtn #openUsernameDialog>
          Trigger modal
        </button>

        <hlm-dialog-content *brnDialogContent="let ctx" class="max-w-[23rem]">
          <hlm-dialog-header>
            <h3 brnDialogTitle hlm class="font-bold text-lg">
              Welcome to CV 👋
            </h3>
            <p brnDialogDescription hlm>
              We just need a few details to finish creating your account. You
              can always change this later.
            </p>
          </hlm-dialog-header>

          <form [formGroup]="usernameForm" class="flex flex-col gap-2">
            <label hlmLabel class="text-xs">
              Username
              <input
                type="text"
                hlmInput
                formControlName="username"
                placeholder="Your unique &#64;username"
                class="!outline-none !ring-0 w-80 mt-1"
              />
            </label>
            <label hlmLabel class="text-xs">
              <div class="flex justify-between">
                <p>Display name</p>
                <p>{{ usernameForm.get('displayName')?.value.length }} of 48</p>
              </div>
              <input
                type="text"
                hlmInput
                formControlName="displayName"
                maxlength="48"
                placeholder="The name on your profile"
                class="!outline-none !ring-0 w-80 mt-1"
              />
            </label>
          </form>

          <hlm-dialog-footer>
            <button hlmBtn type="submit">Continue</button>
          </hlm-dialog-footer>
        </hlm-dialog-content>
      </hlm-dialog>
    </main>
  </div> `,
  styles: [],
})
export default class HomeComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  dialogService = inject(DialogStateService);
  screenSize = inject(ResponsiveBreakpointService);

  @ViewChild('openUsernameDialog') usernameDialog?: ElementRef;

  public usernameForm!: FormGroup;

  constructor() {
    this.userService.current_user$.subscribe((user) => {
      if (user === null && this.authService.auth_user() !== null) {
        setTimeout(() => {
          this.openUsernameDialog();
        }, 1000);
      }
    });

    this.usernameForm = this.formBuilder.group({
      username: [{ value: '', disabled: false }, [Validators.required]],
      displayName: [
        { value: '', disabled: false },
        [Validators.required, Validators.maxLength(48)],
      ],
    });
  }

  openUsernameDialog() {
    this.usernameDialog?.nativeElement.click();
  }
}
