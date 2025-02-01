import { NgClass } from '@angular/common';
import { User } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { imageIcon } from '@components/svg-icon/icons';
import { TextFieldModule } from '@angular/cdk/text-field';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { AvatarComponent } from '../avatar/avatar.component';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';

@Component({
  selector: 'App-post-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, FormsModule, AvatarComponent, TextFieldModule, HlmButtonModule, SvgIconComponent],
  template: `
    <div
      class="flex gap-3 px-6 py-5 border-b border-gray-400 max-h-screen"
      [ngClass]="textareaFocusState() ? 'items-start' : 'items-center'"
    >
      <App-avatar buttonVariant="medium" [name]="currentUser().displayName!" [avatarUrl]="currentUser().photoURL" />

      <div class="flex flex-col items-start w-full">
        @if (textareaFocusState()) {
          <p class="antialiased text-sm text-muted-foreground mb-2">Anyone can reply</p>
        }
        <textarea
          #textarea
          type="text"
          cdkTextareaAutosize
          [cdkAutosizeMinRows]="textareaFocusState() ? 2 : 1"
          cdkAutosizeMaxRows="35"
          #autosize="cdkTextareaAutosize"
          [(ngModel)]="textareaValue"
          (focus)="onFocusEvent($event)"
          placeholder="What's on your mind..."
          class="max-h-screen focus:outline-none w-full"
        ></textarea>

        @if (textareaFocusState()) {
          <div class="flex justify-between w-full mt-3">
            <button>
              <App-svg-icon [icon]="imageIcon" icon_class="w-7 h-7" />
            </button>
            <div class="flex gap-x-2 items-end justify-end w-full">
              <button hlmBtn variant="link" class="h-8" (click)="onBlurEvent($event)">Cancel</button>
              <button
                hlmBtn
                [disabled]="textareaValue().length === 0 ? true : false"
                type="submit"
                class="py-0 px-3 !h-8"
              >
                Post
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class PostComposerComponent {
  currentUser = input.required<User>();

  textareaValue = model<string>('');
  textareaFocusState = signal<boolean>(false);

  imageIcon = imageIcon;

  onFocusEvent(event: FocusEvent): void {
    this.textareaFocusState.set(true);
    console.log('Textarea has received focus');
  }

  onBlurEvent(event: MouseEvent): void {
    this.textareaFocusState.set(false);
    console.log('Textarea has received focus');
  }
}
