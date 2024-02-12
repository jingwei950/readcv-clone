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
    .observe('(min-width: 279px) and (max-width: 540px)')
    .pipe(map((result) => result.matches));

  // To handle tablet
  isTablet$: Observable<boolean> = this.breakpointObserver
    .observe('(min-width: 541px) and (max-width: 800px)')
    .pipe(map((result) => result.matches));

  // To handle web
  isWeb$: Observable<boolean> = this.breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(map((result) => result.matches));
}
