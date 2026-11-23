import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { startWith, switchMap } from 'rxjs';
import { SelectOption } from '../../models/responses/select-option';

@Component({
  selector: 'app-general-select',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './general-select.html',
  styleUrl: './general-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralSelect {
  readonly fGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input('');
  readonly errorMessage = input('');
  readonly options = input<SelectOption[]>([]);
  // Si se indica, el select suma una primera opción vacía con este texto (ej. "Sin menú"); al elegirla el valor queda en "" (texto vacío)
  readonly emptyLabel = input('');
  readonly changed = output<void>();

  // El valor del formulario puede ser texto ("5") y el de la opción un número (5): se comparan como texto
  protected readonly compararValores = (a: unknown, b: unknown): boolean => String(a ?? '') === String(b ?? '');

  // El FormControl se busca dentro del FormGroup con el nombre recibido
  protected readonly control = computed(() => {
    const control = this.fGroup().get(this.controlName());

    if (!(control instanceof FormControl)) {
      throw new Error(`app-general-select: el FormGroup no tiene un control llamado "${this.controlName()}"`);
    }

    return control;
  });

  // Emite cada vez que el control cambia (valor, validez, touched...).
  // Así el componente se actualiza solo, aunque el padre llame a markAllAsTouched().
  private readonly cambios = toSignal(
    toObservable(this.control).pipe(switchMap((control) => control.events.pipe(startWith(null)))),
  );

  protected readonly mostrarError = computed(() => {
    this.cambios();
    const control = this.control();

    return control.invalid && control.touched;
  });
}
