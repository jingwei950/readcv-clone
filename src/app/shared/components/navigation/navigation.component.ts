// Angular imports
import {
  inject,
  signal,
  Component,
  viewChild,
  ViewChild,
  ElementRef,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  BrnDialogComponent,
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';
import {
  HlmTooltipComponent,
  HlmTooltipTriggerDirective,
} from '@spartan-ng/ui-tooltip-helm';
import {
  HlmDialogComponent,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogContentComponent,
} from '@spartan-ng/ui-dialog-helm';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { imageIcon, plusIcon } from '@components/svg-icon/icons';
import { NavigationService } from '@services/navigation.service';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { BrnTooltipContentDirective } from '@spartan-ng/brain/tooltip';
import { SvgIconComponent } from '@components/svg-icon/svg-icon.component';
import { NavButtonsComponent } from '@components/nav-buttons/nav-buttons.component';
import { ResponsiveBreakpointService } from '@services/responsive-breakpoint.service';

@Component({
  selector: 'App-navigation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AvatarComponent,
    SvgIconComponent,
    HlmButtonDirective,
    HlmDialogComponent,
    HlmTooltipComponent,
    NavButtonsComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogContentComponent,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    BrnTooltipContentDirective,
    HlmTooltipTriggerDirective,
  ],
  styles: `
    textarea {
      field-sizing: content;
    }
  `,
  template: `
    <div class="flex items-start justify-center ml-auto sticky top-0">
      <div class="w-full flex flex-col justify-center items-center">
        @for (icon of navigationIconState(); track $index) {
        <div class="w-16 h-16 inline-flex items-center justify-center ml-auto">
          <App-nav-buttons
            [icon]="icon"
            [iconSelected]="icon.iconSelected"
            (onClick)="changeState($event)"
          />
        </div>
        } @if (currentUser()) {
        <hlm-tooltip>
          <button
            position="right"
            brnDialogTrigger
            hlmTooltipTrigger
            aria-describedby="profile"
            class="w-16 h-16 inline-flex items-center justify-center ml-auto"
            [routerLink]="'/profile/' + currentUser()?.displayName"
          >
            <App-avatar
              buttonVariant="small"
              [name]="currentUser()?.displayName!"
              [avatarUrl]="currentUser()?.photoURL"
            ></App-avatar>
          </button>
          <span *brnTooltipContent class="capitalize">profile</span>
        </hlm-tooltip>
        <div class="w-16 h-16 inline-flex items-center justify-center ml-auto">
          <hlm-dialog>
            <hlm-tooltip>
              <button
                position="right"
                brnDialogTrigger
                hlmTooltipTrigger
                aria-describedby="createPost"
                class="flex justify-center items-center rounded-full w-9 h-9 bg-primary"
              >
                <App-svg-icon
                  [icon]="plusIcon"
                  icon_class="w-4 h-4 fill-white"
                />
              </button>

              <span *brnTooltipContent class="capitalize">create post</span>
            </hlm-tooltip>
            <hlm-dialog-content
              #textareaContainer
              *brnDialogContent="let ctx"
              class="sm:min-w-[480px] sm:min-h-[168px] !w-full"
            >
              <hlm-dialog-header [style]="'height:' + textareaElScrollHeight()">
                <h3 brnDialogTitle hlm>Anyone can reply</h3>
                <textarea
                  #textarea
                  class="inline-flex flex-1 max-h-screen min-h-0 grow overflow-hidden resize-none outline-0 ring-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-96 w-full"
                  type="text"
                  placeholder="What's on your mind?"
                ></textarea>
              </hlm-dialog-header>
              <hlm-dialog-footer>
                <div class="flex justify-between items-end w-full">
                  <App-svg-icon [icon]="imageIcon" icon_class="w-7 h-7" />
                  <div>
                    <button
                      hlmBtn
                      variant="link"
                      class="h-8"
                      (click)="closeDialog()"
                    >
                      Cancel
                    </button>
                    <button hlmBtn type="submit" class="py-0 px-3 !h-8">
                      Post
                    </button>
                  </div>
                </div>
              </hlm-dialog-footer>
            </hlm-dialog-content>
          </hlm-dialog>
        </div>
        }
      </div>
    </div>
  `,
})
export class NavigationComponent {
  public authService = inject(AuthService);
  public navService = inject(NavigationService);
  public screenSize = inject(ResponsiveBreakpointService);

  navigationState = this.navService.navState;
  currentUser = this.authService.auth_user;
  navigationIconState = this.navService.iconState;

  viewchildDialogRef = viewChild(BrnDialogComponent);
  textareaEl = viewChild<ElementRef>('textarea');
  textareaContainerEl = viewChild<
    HlmDialogHeaderComponent,
    ElementRef<HlmDialogHeaderComponent>
  >(HlmDialogHeaderComponent, { read: ElementRef });

  plusIcon = plusIcon;
  imageIcon = imageIcon;

  textareaElScrollHeight = signal<string>('');

  @ViewChild('textarea', { static: false }) myElementRef!: ElementRef;

  desiredHeight: number = 200; // Set your desired height in pixels

  ngAfterViewInit() {
    if (this.myElementRef) {
      console.log(this.myElementRef);
      this.myElementRef.nativeElement.style.height = `${this.desiredHeight}px`;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  closeDialog() {
    this.viewchildDialogRef()?.close({});
  }

  changeState(e: any) {
    this.navService.navState.set(e);

    this.navigationIconState.set(
      this.navigationIconState().map((item, i) => {
        if (item.alias !== e) {
          return {
            ...this.navigationIconState()[i],
            iconSelected: false,
          };
        } else {
          return {
            ...this.navigationIconState()[i],
            iconSelected: true,
          };
        }
      })
    );
  }
}
