import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-general-failled-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './app-general-failled-button.html',
  styleUrl: './app-general-failled-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppGeneralFailledButton {
  readonly label = input('Guardar');
  // Icono opcional a la izquierda del texto (Material o Font Awesome). Vacío = sin icono
  readonly icon = input('');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  // Color del tema. "secondary" (o sin color) pinta el botón de gris, igual que app-general-button
  readonly color = input<ThemePalette | 'secondary'>('primary');
  readonly clicked = output<void>();

  protected readonly gris = computed(() => {
    const color = this.color();

    return color !== 'primary' && color !== 'accent' && color !== 'warn';
  });

  // Material solo conoce primary/accent/warn; el gris se pinta con la clase "gris"
  protected readonly colorMaterial = computed<ThemePalette>(() => (this.gris() ? undefined : (this.color() as ThemePalette)));

  // Font Awesome si empieza por "fa-" o "fa " (ej. "fa-solid fa-floppy-disk")
  protected readonly esFontAwesome = computed(() => /^fa[ -]/.test(this.icon()));
}
