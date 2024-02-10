import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor() {}

  navState = signal<string>('home');
  filterState = signal<string>('highlight');
  notificationFilterState = signal<string>('all');
}
