import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveBreakpointService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  // To handle handset
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe('(min-width: 279px) and (max-width: 640px)')
    .pipe(map((result) => result.matches));

  // To handle tablet
  isTablet$: Observable<boolean> = this.breakpointObserver
    .observe('(min-width: 641px) and (max-width: 1080px)')
    .pipe(map((result) => result.matches));

  // To handle web
  isWeb$: Observable<boolean> = this.breakpointObserver
    .observe('(min-width: 1081px)')
    .pipe(map((result) => result.matches));

  // To handle MDPI height screen size
  isMDPI$: Observable<boolean> = this.breakpointObserver
    .observe('(max-height: 899px)')
    .pipe(map((result) => result.matches));

  // To handle HiDPI height screen size
  isHiDPI$: Observable<boolean> = this.breakpointObserver
    .observe('(min-height: 900px) and (max-height: 969px)')
    .pipe(map((result) => result.matches));

  // To handle XHDPI height screen size (Usual screen size)
  isXHDPI$: Observable<boolean> = this.breakpointObserver
    .observe('(min-height: 970px)')
    .pipe(map((result) => result.matches));
}
