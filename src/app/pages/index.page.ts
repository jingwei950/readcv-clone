// Angular imports
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import {
  HlmDialogComponent,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogContentComponent,
} from '@spartan-ng/ui-dialog-helm';
import { AsyncPipe, NgClass } from '@angular/common';
import { UserService } from '@services/user.service';
import { AuthService } from '@services/auth.service';
import { AuthFlowService } from '@services/auth-flow.service';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { DialogStateService } from '@services/dialog-state.service';
import { inject, Component, ElementRef, DestroyRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostFeedComponent } from '@components/post-feed/post-feed.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { ResponsiveBreakpointService } from '@services/responsive-breakpoint.service';
import { JobListingsComponent } from '@components/job-listings/job-listings.component';
import { User as FirebaseUser } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    PostFeedComponent,
    HlmInputDirective,
    HlmDialogComponent,
    HlmButtonDirective,
    ReactiveFormsModule,
    NavigationComponent,
    JobListingsComponent,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogContentComponent,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
  ],
  template: `
    <div class="w-full h-screen">
      <main class="flex justify-center mx-auto w-full max-w-[calc(300px+604px+300px)]">
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
          <button class="hidden" brnDialogTrigger hlmBtn #openUsernameDialog>Trigger modal</button>

          <hlm-dialog-content *brnDialogContent="let ctx" class="max-w-[23rem]">
            <hlm-dialog-header>
              <h3 brnDialogTitle hlm class="font-bold text-lg dark:text-grey1">Welcome to CV 👋</h3>
              <p brnDialogDescription hlm>Enter a username to complete your account setup.</p>
            </hlm-dialog-header>

            <form [formGroup]="usernameForm" class="flex flex-col gap-2">
              <label hlmLabel class="text-xs dark:text-primary">
                Username
                <input
                  type="text"
                  hlmInput
                  formControlName="username"
                  placeholder="Your unique &#64;username"
                  class="!outline-none !ring-0 w-80 mt-1 border-none dark:bg-foreground"
                  [ngClass]="{
                    'border-red-500': usernameForm.get('username')?.invalid && usernameForm.get('username')?.touched,
                  }"
                />
                @if (usernameForm.get('username')?.hasError('required') && usernameForm.get('username')?.touched) {
                  <p class="text-red-500 text-xs mt-1">Username is required</p>
                }
                @if (usernameForm.get('username')?.hasError('unavailable')) {
                  <p class="text-red-500 text-xs mt-1">This username is already taken</p>
                }
              </label>
            </form>

            <hlm-dialog-footer>
              <button
                hlmBtn
                type="submit"
                size="sm"
                [disabled]="!usernameForm.valid || usernameForm.disabled"
                (click)="submitUsernameForm(ctx)"
                class="bg-foreground dark:bg-foreground dark:text-grey1 font-bold"
                [ngClass]="{ 'opacity-50 cursor-not-allowed': !usernameForm.valid || usernameForm.disabled }"
              >
                {{ usernameForm.disabled ? 'Saving...' : 'Continue' }}
              </button>
            </hlm-dialog-footer>
          </hlm-dialog-content>
        </hlm-dialog>
      </main>
    </div>
  `,
})
export default class HomeComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  authFlowService = inject(AuthFlowService);
  formBuilder = inject(FormBuilder);
  dialogService = inject(DialogStateService);
  screenSize = inject(ResponsiveBreakpointService);
  destroyRef = inject(DestroyRef);

  usernameDialog = viewChild<ElementRef>('openUsernameDialog');

  usernameForm: FormGroup = this.formBuilder.group({
    username: [{ value: '', disabled: false }, [Validators.required]],
  });

  currentUser = toSignal(this.userService.current_user$, { initialValue: null });

  constructor() {
    // Subscribe to user changes and handle the dialog in a way that respects component lifecycle
    this.userService.current_user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      const authUser = this.authService.auth_user();

      // Show dialog if user is authenticated but either:
      // 1. No Firestore profile exists (user is null)
      // 2. Firestore profile exists but username is empty/undefined
      if (authUser !== null && (user === null || !user.username)) {
        // Delay to ensure the view is initialized
        setTimeout(() => {
          this.openUsernameDialog();
        }, 1000);
      }
    });
  }

  openUsernameDialog() {
    // Safely access the dialog element
    const dialogElement = this.usernameDialog()?.nativeElement;
    if (dialogElement) {
      dialogElement.click();
    }
  }

  // Handle username form submission by creating user profile in Firestore
  submitUsernameForm(dialogContext: any) {
    if (this.usernameForm.valid) {
      const username = this.usernameForm.get('username')?.value;
      const currentUser = this.authService.auth_user();

      if (currentUser) {
        // Disable form during submission
        this.usernameForm.disable();

        // Use AuthFlowService to update the user profile with only username
        // Use the displayName from the Firebase auth user or the username as fallback
        const displayName = currentUser.displayName || username;

        this.authFlowService
          .updateUserProfile(currentUser as FirebaseUser, displayName, username)
          .then((success) => {
            if (success) {
              console.log('Profile created successfully');
              dialogContext.close();
            } else {
              console.error('Failed to create profile');
              // Re-enable the form
              this.usernameForm.enable();

              // Show error message
              this.usernameForm.get('username')?.setErrors({ unavailable: true });
            }
          })
          .catch((error) => {
            console.error('Error updating profile:', error);
            this.usernameForm.enable();

            // Handle specific error cases if needed
            if (error.code === 'username-taken') {
              this.usernameForm.get('username')?.setErrors({ unavailable: true });
            }
          });
      }
    }
  }
}
