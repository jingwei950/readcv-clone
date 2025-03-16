import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  isDark = signal<boolean>(false);
  isDarkMode = this.isDark.asReadonly();
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize theme only in the browser
      this.initializeTheme();

      effect(() => {
        if (this.isDark()) {
          this.document.body.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          this.document.body.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      });
    }
  }

  private initializeTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDark.set(true);
      } else if (savedTheme === 'light') {
        this.isDark.set(false);
      } else {
        // Optional: Check system preference if no saved theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDark.set(prefersDark);
      }
    }
  }

  toggleDarkMode() {
    this.isDark.update((dark) => !dark);
  }
}
