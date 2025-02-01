import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogStateService {
  slideNum = signal(1);

  displayCloseBtn = signal(false);

  constructor() {}
}
