import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProfilePost } from '../../models/profile.model';
import { EnrichedProfile } from '../../services/profile.service';
import { ChangeDetectionStrategy, Component, computed, effect, input, inject, signal } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideSend, lucideCheck } from '@ng-icons/lucide';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'App-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule, HlmButtonDirective, NgIcon, HlmIconDirective],
  providers: [provideIcons({ lucideSend, lucidePencil, lucideCheck })],
  template: `
    <div class="mx-auto bg-white dark:bg-transparent overflow-hidden">
      <!-- Profile Header -->
      <div class="pt-3 px-6 pb-9">
        <div class="flex flex-row items-center justify-center gap-3">
          <img
            [src]="profile()?.avatarUrl"
            alt="Profile Picture"
            class="rounded-full bg-white dark:bg-gray-800 flex-shrink-0 w-[92px] h-[92px]"
          />

          <div class="flex flex-col flex-grow">
            <div class="text-lg font-bold mb-0 flex items-center text-left">
              <span class="text-gray-900 dark:text-white">{{ profile()?.name }}</span>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-300 mt-0 text-left">
              {{ profileDetails() }}
            </p>

            <div class="mt-2 text-sm text-left">
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:underline">
                {{ profile()?.website }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3 px-8 pb-4">
        @if (isProfileOwner()) {
          <!-- Show follower/following counts for profile owner -->
          <button
            hlmBtn
            class="bg-foreground hover:bg-gray-800 dark:bg-foreground dark:text-grey1 w-full h-12 flex justify-center items-center py-2.5 text-sm antialiased px-4 rounded-full transition-colors"
            (click)="navigateToFollowers()"
          >
            <span>{{ profile()?.followerCount || 0 }} followers</span>
          </button>
          <button
            hlmBtn
            class="bg-foreground hover:bg-gray-800 dark:bg-foreground dark:text-grey1 w-full h-12 flex justify-center py-2.5 text-sm antialiased px-4 rounded-full transition-colors"
            (click)="navigateToFollowing()"
          >
            <span>{{ profile()?.followingCount || 0 }} following</span>
          </button>
          <div class="flex-shrink-0">
            <button
              hlmBtn
              class="!rounded-full bg-foreground dark:bg-foreground text-grey1 flex items-center justify-center w-12 h-12 flex-shrink-0 aspect-square overflow-hidden p-0"
              (click)="navigateToEditProfile()"
            >
              <ng-icon hlm size="20px" name="lucidePencil" class="text-white" />
            </button>
          </div>
        } @else {
          <!-- Show follow and message buttons for other profiles -->
          <button
            hlmBtn
            class="bg-foreground hover:bg-gray-800 dark:bg-foreground dark:text-grey1 w-full flex justify-center py-2.5 text-sm antialiased px-4 rounded-full transition-colors"
            (click)="toggleFollow()"
            [disabled]="isFollowLoading()"
          >
            @if (isFollowing()) {
              <ng-icon hlm size="16px" name="lucideCheck" class="mr-2 text-current" />
              <span>following</span>
            } @else {
              <span>Follow</span>
            }
          </button>
          <div class="flex-shrink-0">
            <button
              hlmBtn
              class="!rounded-full bg-foreground dark:bg-foreground text-white flex items-center justify-center w-12 h-12 flex-shrink-0 aspect-square overflow-hidden p-0"
            >
              <ng-icon hlm size="20px" name="lucideSend" class="text-white" />
            </button>
          </div>
        }
        <button
          hlmBtn
          class="!rounded-full bg-foreground dark:bg-foreground text-grey1 flex items-center justify-center w-12 h-12 flex-shrink-0 aspect-square overflow-hidden p-0"
          (click)="navigateToEditProfile()"
        >
          <ng-icon hlm size="20px" name="lucidePencil" class="text-white" />
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-300 dark:border-primaryBorderColor px-8 justify-between">
        <a
          href="#"
          class="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white flex-1 text-center"
        >
          Posts
        </a>
        <a
          href="#"
          class="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-700 dark:hover:text-gray-300 flex-1 text-center"
        >
          Replies
        </a>
        <a
          href="#"
          class="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-700 dark:hover:text-gray-300 flex-1 text-center"
        >
          Media
        </a>
      </div>

      <!-- Profile Content -->
      <div class="py-6 text-left">
        <!-- Posts -->
        @for (post of profile()?.posts; track post.content) {
          <div class="px-8 mb-6 pb-6 border-b dark:border-primaryBorderColor text-left">
            <p class="text-gray-800 dark:text-gray-200 text-left">{{ post.content }}</p>
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-left">{{ post.date }}</div>
            <div class="flex gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400 justify-start">
              <div class="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  ></path>
                </svg>
                {{ post.likes }}
              </div>
              <div class="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  ></path>
                </svg>
                {{ post.comments }}
              </div>
            </div>
          </div>
        } @empty {
          <div class="px-8 text-center py-6 text-gray-500 dark:text-gray-400 text-base font-semibold">
            No posts yet 🍃
          </div>
        }
      </div>
    </div>
  `,
})
export class ProfileComponent {
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private userService = inject(UserService);

  profile = input<EnrichedProfile>();
  isProfileOwner = input<boolean>(false); // Default to false

  // Convert current user to signal
  currentUser = toSignal(this.userService.current_user$);

  // Loading state
  isFollowLoading = signal<boolean>(false);

  // Following state
  isFollowing = signal<boolean>(false);

  profileDetails = computed<string>(() => {
    const occupation = this.profile()?.occupation;
    const location = this.profile()?.location;
    const pronouns = this.profile()?.pronouns;

    const parts: string[] = [];

    // Add occupation if available
    if (occupation) {
      parts.push(occupation);
    }

    // Add location if available
    if (location) {
      // Only add "in" if there's an occupation
      parts.push(occupation ? `in ${location}` : location);
    }

    // Add pronouns if available
    if (pronouns) {
      parts.push(pronouns);
    }

    // Join all available parts with appropriate separators
    if (parts.length === 0) {
      return ''; // No info available
    } else if (parts.length === 1) {
      return parts[0]; // Just one piece of info
    } else {
      // Custom formatting to handle the "in" case specially
      let result = '';

      for (let i = 0; i < parts.length; i++) {
        if (i === 0) {
          // First part (no prefix needed)
          result += parts[i];
        } else if (parts[i].startsWith('in ')) {
          // If this part starts with "in", don't add a comma before it
          result += ' ' + parts[i];
        } else {
          // Otherwise add a comma
          result += ', ' + parts[i];
        }
      }

      return result;
    }
  });

  constructor() {
    // Initialize following state based on profile and current user
    effect(() => {
      const user = this.currentUser();
      const profileId = this.profile()?.uid;

      if (user && profileId && user.uid !== profileId) {
        // When profile or user changes, check following status
        this.checkFollowingStatus(user.uid, profileId);
      }
    });
  }

  /**
   * Check if current user is following the profile
   */
  private checkFollowingStatus(userId: string, profileId: string): void {
    this.profileService.isFollowing(userId, profileId).subscribe((following) => {
      this.isFollowing.set(following);
    });
  }

  /**
   * Toggle follow/unfollow status for the current profile
   */
  async toggleFollow(): Promise<void> {
    const user = this.currentUser();
    const profileId = this.profile()?.uid;

    if (!user || !profileId || this.isFollowLoading()) {
      return;
    }

    this.isFollowLoading.set(true);

    try {
      if (this.isFollowing()) {
        // Unfollow the user
        await this.profileService.unfollowUser(user.uid, profileId);
        this.isFollowing.set(false);
      } else {
        // Follow the user
        await this.profileService.followUser(user.uid, profileId);
        this.isFollowing.set(true);
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      this.isFollowLoading.set(false);
    }
  }

  // Navigation methods
  navigateToFollowers() {
    const username = this.profile()?.username;
    if (username) {
      this.router.navigate(['/profile', username, 'followers']);
    }
  }

  navigateToFollowing() {
    const username = this.profile()?.username;
    if (username) {
      this.router.navigate(['/profile', username, 'following']);
    }
  }

  navigateToEditProfile() {
    this.router.navigate(['/settings/profile']);
  }

  // Default posts
  defaultPosts: ProfilePost[] = [
    {
      content: 'How do I file a bug report? I think posting stopped working.',
      date: '12d',
      likes: 3,
      comments: 1,
    },
    {
      content: 'I fear something terrible has happened.',
      date: '12d',
      likes: 3,
      comments: 0,
    },
  ];
}
