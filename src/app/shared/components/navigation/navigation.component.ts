// Angular imports
import { inject, Component, viewChild, ChangeDetectionStrategy, model } from '@angular/core';
import {
  BrnDialogComponent,
  BrnDialogContentDirective,
  BrnDialogTitleDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/brain/dialog';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';
import {
  HlmDialogComponent,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogContentComponent,
} from '@spartan-ng/ui-dialog-helm';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { imageIcon, plusIcon } from '@components/svg-icon/icons';
import { NavigationService } from '@services/navigation.service';
import { BrnTooltipContentDirective } from '@spartan-ng/brain/tooltip';
import { SvgIconComponent } from '@components/svg-icon/svg-icon.component';
import { NavButtonsComponent } from '@components/nav-buttons/nav-buttons.component';

@Component({
  selector: 'App-navigation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TextFieldModule,
    SvgIconComponent,
    HlmButtonDirective,
    HlmDialogComponent,
    HlmTooltipComponent,
    NavButtonsComponent,
    BrnDialogTitleDirective,
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
            <App-nav-buttons [icon]="icon" [iconSelected]="icon.iconSelected" (onClick)="changeState($event)" />
          </div>
        }

        @if (currentUser()) {
          <div class="w-16 h-16 inline-flex items-center justify-center ml-auto">
            <hlm-dialog>
              <hlm-tooltip>
                <button
                  position="right"
                  brnDialogTrigger
                  hlmTooltipTrigger
                  aria-describedby="createPost"
                  class="flex justify-center items-center rounded-full w-9 h-9 bg-primary dark:bg-grey1"
                >
                  <App-svg-icon [icon]="plusIcon" icon_class="w-4 h-4 fill-white dark:!fill-black" />
                </button>

                <span *brnTooltipContent class="capitalize">create post</span>
              </hlm-tooltip>
              <hlm-dialog-content
                #textareaContainer
                *brnDialogContent="let ctx"
                class="sm:min-w-[480px] sm:min-h-[168px] max-h-screen !w-full dark:text-white"
              >
                <hlm-dialog-header>
                  <p class="!text-grey3 antialiased mb-2 text-xs" brnDialogTitle>Anyone can reply</p>
                  <textarea
                    #textarea
                    cdkTextareaAutosize
                    cdkAutosizeMaxRows="35"
                    #autosize="cdkTextareaAutosize"
                    [(ngModel)]="textareaValue"
                    class="max-h-screen focus:outline-none placeholder:text-base dark:placeholder:text-grey3 dark:bg-background dark:text-grey2"
                    type="text"
                    placeholder="What's on your mind..."
                  ></textarea>
                </hlm-dialog-header>
                <hlm-dialog-footer>
                  <div class="flex justify-between items-end w-full">
                    <App-svg-icon [icon]="imageIcon" icon_class="w-7 h-7 dark:fill-grey1" />
                    <div>
                      <button hlmBtn variant="link" class="h-8" (click)="closeDialog()">Cancel</button>
                      <button
                        hlmBtn
                        [disabled]="textareaValue().length === 0"
                        type="submit"
                        class="py-0 px-3 !h-8 dark:bg-grey1 font-semibold"
                      >
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

  navigationState = this.navService.navState;
  currentUser = this.authService.auth_user;
  navigationIconState = this.navService.iconState;

  viewchildDialogRef = viewChild(BrnDialogComponent);

  plusIcon = plusIcon;
  imageIcon = imageIcon;

  textareaValue = model<string>('');

  closeDialog() {
    this.viewchildDialogRef()?.close({});
  }

  changeState(e: string) {
    this.navService.updateNavState(e);
  }
}
