import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-general-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './general-button.html',
  styleUrl: './general-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralButton {
  readonly icon = input('save');
  readonly type = input<'button' | 'submit'>('button');
  readonly tooltip = input('Guardar');
  readonly disabled = input(false);
  // Color del tema. "secondary" (o sin color) pinta el botón de gris, como el de editar y cancelar del sistema académico
  readonly color = input<ThemePalette | 'secondary'>('primary');
  readonly clicked = output<void>();

  protected readonly gris = computed(() => {
    const color = this.color();

    return color !== 'primary' && color !== 'accent' && color !== 'warn';
  });

  // Material solo conoce primary/accent/warn; el gris se pinta con la clase "gris"
  protected readonly colorMaterial = computed<ThemePalette>(() => (this.gris() ? undefined : (this.color() as ThemePalette)));

  // Font Awesome si empieza por "fa-" o "fa " (ej. "fa-solid fa-xmark", "fa fa-search")
  protected readonly esFontAwesome = computed(() => /^fa[ -]/.test(this.icon()));
}
