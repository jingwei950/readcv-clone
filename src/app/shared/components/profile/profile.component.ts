import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Profile, ProfilePost } from '../../models/profile.model';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'App-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="mx-auto bg-white dark:bg-transparent overflow-hidden shadow-sm border-b border-gray-100 dark:border-primaryBorderColor"
    >
      <!-- Profile Header -->
      <div class="p-8 pb-4">
        <div class="flex flex-row items-center justify-center gap-3">
          <img
            [src]="
              profile()?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470'
            "
            alt="Profile Picture"
            class="rounded-full bg-white dark:bg-gray-800 flex-shrink-0"
            style="width: 100px; height: 100px;"
          />

          <div class="flex flex-col flex-grow">
            <div class="text-lg font-bold mb-0 flex items-center text-left">
              <span class="text-gray-900 dark:text-white">{{ profile()?.name || 'Taurean Bryant' }}</span>
              <span class="ml-2 text-gray-500 dark:text-gray-400">Not Found</span>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-300 mt-0 text-left">
              {{ profile()?.headline || 'Design engineer in Vallejo CA, He/Him' }}
            </p>

            <div class="mt-2 text-sm text-left">
              <a href="#" class="text-gray-500 dark:text-gray-400 hover:underline">
                {{ profile()?.links?.[0] || 'Taurean.work' }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3 mt-4 px-8 pb-4">
        <button
          class="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 w-full flex justify-center py-2.5 text-sm antialiased font-bold px-4 py-1.5 rounded-full transition-colors"
        >
          Follow
        </button>
        <button
          class="p-2 flex items-center justify-center bg-foreground dark:bg-foreground rounded-full transition-colors text-white"
          style="width: 48px; height: 48px;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 28 28"
            width="24"
            height="24"
            fill="white"
            stroke="white"
            stroke-width="0.5"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M20.608 3.463c1.204-.794 2.798.126 2.711 1.565l-1.09 18.154c-.089 1.493-1.888 2.193-2.963 1.153l-5.667-5.48a.25.25 0 00-.105-.06l-7.58-2.168c-1.437-.412-1.73-2.32-.483-3.143l15.177-10.02zm1.214 1.476a.25.25 0 00-.387-.224L6.258 14.735a.25.25 0 00.069.45l7.58 2.168c.276.079.528.224.735.424l5.667 5.48a.25.25 0 00.423-.165l1.09-18.153z"
            ></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.19 7.317l-5.383 11.325-1.732-1L20.19 7.317z"></path>
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-100 dark:border-primaryBorderColor px-8 justify-between">
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
        @for (post of profile()?.posts || defaultPosts; track post.content) {
          <div class="px-8 mb-6 pb-6 border-b dark:border-primaryBorderColor last:border-0 text-left">
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
          <div class="px-8 text-center py-6 text-gray-500 dark:text-gray-400">No posts to display</div>
        }
      </div>
    </div>
  `,
})
export class ProfileComponent {
  profile = input<Profile>();

  // Default links to show when no profile is provided
  defaultLinks = ['Portfolio', 'Twitter', 'LinkedIn', 'GitHub'];

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
