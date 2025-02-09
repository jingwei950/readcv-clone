// Angular imports
import {
  BrnDialogCloseDirective,
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';
import appleIcon from '@svg/apple-icon';
import googleIcon from '@svg/google-icon';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideHeart } from '@ng-icons/lucide';
import { AuthService } from '@services/auth.service';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { DarkModeService } from '@services/dark-mode.service';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { DialogStateService } from '@services/dialog-state.service';
import { HlmDialogComponent, HlmDialogHeaderComponent, HlmDialogContentComponent } from '@spartan-ng/ui-dialog-helm';
import { effect, inject, Component, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'App-job-listings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideHeart, lucideChevronRight })],
  imports: [
    HlmIconDirective,
    HlmInputDirective,
    HlmDialogComponent,
    HlmButtonDirective,
    ReactiveFormsModule,
    BrnDialogCloseDirective,
    HlmDialogHeaderComponent,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmDialogContentComponent,
  ],
  template: `
    <div class="p-6 w-full">
      <div class="flex flex-col gap-1 items-start">
        <p>Posts</p>
        <p class="text-xs font-normal text-gray-500">A community app by Read.cv</p>
        <div class="flex flex-wrap gap-2">
          <button hlmBtn variant="link" class="text-xs capitalize font-normal !p-0 !items-start">about</button>
          <button hlmBtn variant="link" class="text-xs capitalize font-normal !p-0 !items-start">conduct</button>
          <button hlmBtn variant="link" class="text-xs capitalize font-normal !p-0 !items-start">
            download for iOS
          </button>
        </div>

        @if (!currentUser()) {
          <hlm-dialog class="w-full">
            <button hlmBtn brnDialogTrigger class="rounded-full w-full">Log in with Read.cv</button>
            <hlm-dialog-content *brnDialogContent="let ctx" class="max-w-[375px]" state="closed">
              <div class="relative overflow-hidden">
                <!-- transform: translateX(0%) translateZ(0px); -->
                <div
                  #page1
                  class="flex flex-col w-full transition-all ease-in-out duration-980 transform translate-x-0"
                >
                  <hlm-dialog-header class="">
                    <h3 brnDialogTitle hlm class="font-bold text-lg">Login to your account 👋</h3>
                    <p brnDialogDescription hlm>
                      By continuing you agree to our
                      <button hlmBtn variant="link" class="!p-0 h-auto">terms of service</button>
                      and
                      <button hlmBtn variant="link" class="!p-0 h-auto">privacy policy</button>
                    </p>
                  </hlm-dialog-header>

                  <div class="flex flex-col gap-2 mt-4">
                    <button hlmBtn (click)="googleAuth()">
                      <img [src]="googleIcon.solid" alt="google icon" class="mr-2" />
                      Conitnue with Google
                    </button>
                    <button hlmBtn>
                      <img [src]="appleIcon.solid" alt="apple icon" class="mr-2" />
                      Conitnue with Apple
                    </button>
                    <button hlmBtn variant="link" (click)="changeSlide(slideNum())">Continue with Email</button>
                  </div>
                </div>

                <div
                  #page2
                  class="absolute top-0 left-0 flex flex-col h-full transition-all ease-in-out duration-980 transform translate-x-full"
                >
                  <hlm-dialog-header>
                    <h3 brnDialogTitle hlm class="font-bold text-lg">Continue with an email link 💌</h3>
                    <p brnDialogDescription hlm>Enter your email and we'll send you a link to login to your account.</p>
                  </hlm-dialog-header>

                  <div class="flex flex-col gap-2 mt-4 h-full justify-between">
                    <form [formGroup]="emailForm">
                      <input
                        type="text"
                        hlmInput
                        formControlName="email"
                        placeholder="Email address"
                        class="!outline-none !ring-0 w-full"
                      />
                    </form>
                    <div class="flex justify-end">
                      <button
                        hlmBtn
                        variant="link"
                        class="capitalize"
                        (click)="changeSlide(slideNum(), '', true, false)"
                      >
                        back
                      </button>
                      <button
                        hlmBtn
                        class="capitalize"
                        [disabled]="emailForm.invalid ? true : false"
                        (click)="changeSlide(slideNum(), emailForm.get('email')?.value, false, true)"
                      >
                        submit
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  #page3
                  class="absolute top-0 left-0 right-0 flex flex-col h-full transition-all ease-in-out duration-980 transform translate-x-[200%]"
                >
                  <hlm-dialog-header>
                    <h3 brnDialogTitle hlm class="font-bold text-lg">Check your inbox! 🍄</h3>
                    <p brnDialogDescription hlm>
                      Open the link sent to {{ emailForm.get('email')?.value }} in this browser.
                    </p>
                  </hlm-dialog-header>

                  <div class="flex flex-col gap-2 mt-4 h-full justify-end">
                    <div class="flex justify-end space-x-2">
                      <button hlmBtn variant="link" class="capitalize" (click)="changeSlide(slideNum())">back</button>
                      <button hlmBtn class="capitalize" (click)="triggerClick()">done</button>
                    </div>
                  </div>
                </div>
              </div>
              <button #closeDialog brnDialogClose class="hidden" (click)="triggerClick()">Close modal</button>
            </hlm-dialog-content>
          </hlm-dialog>

          <button hlmBtn class="rounded-full w-full" (click)="authService.logout()">Logout</button>
        } @else {
          <div>
            <ng-icon hlm size="xl" name="lucideChevronRight" />
          </div>
          <button
            hlmBtn
            class="rounded-full w-full bg-warning-foreground text-warning dark:bg-warning dark:text-warning-foreground font-bold"
            (click)="authService.logout()"
          >
            Become a supporter
          </button>

          <button hlmBtn (click)="toggleDarkMode()">Dark mode</button>
        }
      </div>
    </div>
  `,
})
export class JobListingsComponent {
  // Service
  authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  darkModeService = inject(DarkModeService);
  dialogStateService = inject(DialogStateService);

  toggleDarkMode = () => this.darkModeService.toggleDarkMode();

  // HTML element reference
  @ViewChild('page1') page1?: ElementRef;
  @ViewChild('page2') page2?: ElementRef;
  @ViewChild('page3') page3?: ElementRef;
  @ViewChild('closeDialog') closeDialog?: ElementRef;

  public emailForm!: FormGroup; // variable is created of type FormGroup is created
  first_name: string = ''; // Variable is created to show the input value below the button

  // Icons
  googleIcon = googleIcon;
  appleIcon = appleIcon;

  // Shorthand services
  currentUser = this.authService.auth_user;
  slideNum = this.dialogStateService.slideNum;
  googleAuth = () => this.authService.googleAuth();
  sendEmailLinkAuth = (email: string) => {
    this.authService.sendEmailLinkAuth(email);
  };

  constructor() {
    // Form element defined below
    this.emailForm = this.formBuilder.group({
      email: [{ value: '', disabled: false }, [Validators.required, Validators.email]],
    });

    effect(
      () => {
        // Close dialog after user logged in
        if (this.authService.auth_user()) {
          this.triggerClick();
        }
      },
      { allowSignalWrites: true },
    );
  }

  // Change slide animation
  changeSlide(currentSlide: number, email?: string, back?: boolean, submit?: boolean) {
    console.log(email);

    if (currentSlide === 1) {
      this.slideNum.set(2);
      this.page1?.nativeElement.classList.remove('translate-x-0');
      this.page1?.nativeElement.classList.add('-translate-x-full');
      this.page2?.nativeElement.classList.remove('translate-x-full');
      this.page2?.nativeElement.classList.add('translate-x-0');
      this.page3?.nativeElement.classList.remove('translate-x-[200%]');
      this.page3?.nativeElement.classList.add('translate-x-full');
    } else if (currentSlide === 2) {
      if (back) {
        this.slideNum.set(1);
        this.page1?.nativeElement.classList.remove('translate-x-full');
        this.page1?.nativeElement.classList.add('translate-x-0');
        this.page2?.nativeElement.classList.remove('translate-x-0');
        this.page2?.nativeElement.classList.add('translate-x-full');
        this.page3?.nativeElement.classList.remove('translate-x-full');
        this.page3?.nativeElement.classList.add('translate-x-[200%]');
      } else if (submit) {
        this.slideNum.set(3);
        this.sendEmailLinkAuth(email!);
        this.page1?.nativeElement.classList.remove('-translate-x-full');
        this.page1?.nativeElement.classList.add('-translate-x-[200%]');
        this.page2?.nativeElement.classList.remove('translate-x-0');
        this.page2?.nativeElement.classList.add('-translate-x-full');
        this.page3?.nativeElement.classList.remove('translate-x-full');
        this.page3?.nativeElement.classList.add('translate-x-0');
      }
    } else if (currentSlide === 3) {
      this.slideNum.set(2);
      this.page1?.nativeElement.classList.remove('-translate-x-[200%]');
      this.page1?.nativeElement.classList.add('-translate-x-full');
      this.page2?.nativeElement.classList.remove('translate-x-full');
      this.page2?.nativeElement.classList.add('translate-x-0');
      this.page3?.nativeElement.classList.remove('translate-x-0');
      this.page3?.nativeElement.classList.add('translate-x-full');
    }
  }

  triggerClick() {
    this.closeDialog?.nativeElement.click();
    this.slideNum.set(1);
  }
}
