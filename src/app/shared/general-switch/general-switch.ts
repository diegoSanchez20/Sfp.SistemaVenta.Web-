import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-general-switch',
  imports: [MatSlideToggleModule],
  templateUrl: './general-switch.html',
  styleUrl: './general-switch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralSwitch {
  // Estado actual del switch (true = activo)
  readonly checked = input(false);
  readonly label = input('');
  readonly disabled = input(false);
  readonly color = input<ThemePalette>('primary');
  // Emite el nuevo valor cuando el usuario lo cambia
  readonly changed = output<boolean>();

  protected onChange(event: MatSlideToggleChange): void {
    this.changed.emit(event.checked);
  }
}
