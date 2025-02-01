// Angular imports
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// Components
import { AvatarComponent } from '../avatar/avatar.component';

// Models
import { Post } from '@models/post.model';
import { PostUser } from '@models/user.model';
import { PostButtonObj } from '@models/nav-button.model';

// Pipes
import { DateAsAgoPipe } from '../../pipes/date-as-ago.pipe';

// Icons
import {
  heartIcon,
  repostIcon,
  commentIcon,
  bookmarkIcon,
  ellipsisIcon,
} from '@components/svg-icon/icons';

// Spartan-ng imports
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import {
  HlmMenuComponent,
  HlmSubMenuComponent,
  HlmMenuItemDirective,
  HlmMenuGroupComponent,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
} from '@spartan-ng/ui-menu-helm';
import { SvgIconComponent } from '@components/svg-icon/svg-icon.component';

@Component({
  selector: 'App-post-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateAsAgoPipe,
    AvatarComponent,
    HlmButtonDirective,
    SvgIconComponent,
    BrnMenuTriggerDirective,
    HlmMenuComponent,
    HlmMenuItemDirective,
    // HlmMenuItemIconDirective,
    HlmMenuGroupComponent,
    // HlmMenuItemSubIndicatorComponent,
    // HlmSubMenuComponent,
  ],
  template: `
    <div
      class="flex gap-3 p-6 border-b border-gray-400 hover:bg-accent hover:cursor-pointer"
    >
      <!-- Avatar -->
      <App-avatar [avatarUrl]="user?.avatar" [name]="post().name" />

      <div class="flex flex-col">
        <div class="flex">
          <!-- Name -->
          <button
            class="p-0 font-normal text-rvi-gradient"
            hlmBtn
            variant="link"
          >
            {{ user?.name }}
          </button>
          <!-- Username -->
          &nbsp;<button
            class="p-0 text-gray-500 font-normal"
            hlmBtn
            variant="link"
          >
            &commat;{{ post().username }}
          </button>
          <span class="inline-flex items-center text-gray-500"
            >&nbsp;·&nbsp;</span
          >
          <button
            hlmBtn
            variant="link"
            class="p-0 inline-flex items-center text-gray-500 font-normal"
          >
            {{ post().timestamp.toDate() | momentsAgo }}
          </button>
        </div>

        <div class="flex flex-col">
          <!-- Post text -->
          <p class="text-gray-700">{{ post().content }}</p>

          @if (post().contentImgUrl) {
          <img class="rounded-lg mt-3" [src]="post().contentImgUrl" alt="" />
          }
          <!-- Post buttons -->
          <div class="mt-4 flex justify-between items-center w-full">
            @for (icon of postIcons; track $index) {
            <button
              class="flex items-center justify-center w-full gap-2 flex-auto relative translate-x-[calc(-50%+12px)]"
            >
              <App-svg-icon [icon]="icon.icon" icon_class="w-6 h-6" />

              @if ( (icon.name === "comment" && post().commentCount > 0) ||
              (icon.name === "repost" && post().repostCount > 0) || (icon.name
              === "like" && post().likeCount > 0) ) {
              <p>
                {{
                  icon.name === 'comment'
                    ? post().commentCount
                    : icon.name === 'repost'
                    ? post().repostCount
                    : post().likeCount
                }}
              </p>
              }
            </button>
            }

            <div class="flex-1">
              <button
                class="flex items-center justify-center w-full"
                [brnMenuTriggerFor]="menu"
              >
                <App-svg-icon [icon]="ellipsisIcon" icon_class="w-6 h-6" />
              </button>
            </div>

            <ng-template #menu>
              <hlm-menu class="w-56">
                <hlm-menu-group>
                  <button hlmMenuItem (click)="addBookmark()">
                    <span>Add bookmark</span>
                  </button>

                  <button hlmMenuItem (click)="copyLink()">
                    <span>Copy link to post</span>
                  </button>

                  <button hlmMenuItem>
                    <span class="text-destructive">Report post</span>
                  </button>
                </hlm-menu-group>
              </hlm-menu>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PostCardComponent {
  // Input
  post = input.required<Post>();

  // Icons
  // commentIcon: PostButton = commentIcon;
  // repostIcon: PostButton = repostIcon;
  // heartIcon: PostButton = heartIcon;
  // ellipsisIcon: PostButton = ellipsisIcon;

  commentIcon = commentIcon;
  repostIcon = repostIcon;
  heartIcon = heartIcon;
  ellipsisIcon = ellipsisIcon;
  bookmarkIcon = bookmarkIcon;

  postIcons?: PostButtonObj[];
  user?: PostUser;

  ngOnInit() {
    if (this.post()) {
      this.user = {
        name: this.post().name,
        username: this.post().username,
        avatar: this.post().avatar,
      };
    }
    // Post buttons
    this.postIcons = [
      {
        name: 'comment',
        alias: 'comment',
        commentCount: this.post()?.commentCount,
        path: '',
        icon: this.commentIcon,
      },
      {
        name: 'repost',
        alias: 'repost',
        repostCount: this.post()?.repostCount,
        icon: this.repostIcon,
      },
      {
        name: 'like',
        alias: 'like',
        likeCount: this.post()?.likeCount,
        icon: this.heartIcon,
      },
      {
        name: 'bookmark',
        alias: 'bookmark',
        icon: this.bookmarkIcon,
      },
    ];
  }

  addBookmark() {
    console.log('add bookmark clicked');
  }

  copyLink() {
    console.log('copy link');
  }
}
