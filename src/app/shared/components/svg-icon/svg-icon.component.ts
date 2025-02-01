// Angular imports
import { DomSanitizer } from '@angular/platform-browser';
import {
  ChangeDetectionStrategy,
  Component,
  SimpleChanges,
  inject,
  input,
  signal,
} from '@angular/core';

// 3rd party imports
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';

// import icons from './icons';

@Component({
  selector: 'App-svg-icon',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: inline-block;
    }
  `,
  template: `
    <mat-icon
      [svgIcon]="icon_name()!"
      [className]="'block h-auto ' + icon_class()"
    />
  `,
})
export class SvgIconComponent {
  sanitizer = inject(DomSanitizer);
  iconRegistry = inject(MatIconRegistry);

  icon = input.required<string>();
  icon_class = input<string>('');
  icon_name = signal<string | null>(null);

  ngOnChanges(changes: SimpleChanges) {
    // Extract out the icon name from the icon path
    if (this.icon()) {
      this.icon_name.set(this.icon().split('/').pop()?.split('.')[0]!);

      // Register the icon with the icon registry
      if (this.icon_name()) {
        this.iconRegistry.addSvgIcon(
          this.icon_name()!,
          this.sanitizer.bypassSecurityTrustResourceUrl(this.icon())
        );
      }
    }
  }
}
