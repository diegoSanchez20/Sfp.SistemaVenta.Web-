import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-general-input',
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule
],
  templateUrl: './general-input.html',
  styleUrl: './general-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInput {
  readonly fGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input('');
  readonly type = input('text');
  readonly placeholder = input('');
  readonly maxLength = input<number | null>(null);
  readonly errorMessage = input('');
  readonly autocomplete = input('off');
  readonly enter = output<void>();

  protected readonly verPassword = signal(false);
  protected readonly esPassword = computed(() => this.type() === 'password');
  protected readonly tipoReal = computed(() =>
    this.esPassword() && this.verPassword() ? 'text' : this.type(),
  );

  // El FormControl se busca dentro del FormGroup con el nombre recibido
  protected readonly control = computed(() => {
    const control = this.fGroup().get(this.controlName());

    if (!(control instanceof FormControl)) {
      throw new Error(`app-general-input: el FormGroup no tiene un control llamado "${this.controlName()}"`);
    }

    return control;
  });

  // Emite cada vez que el control cambia (valor, validez, touched...).
  // Así el componente se actualiza solo, aunque el padre llame a markAllAsTouched().
  private readonly cambios = toSignal(
    toObservable(this.control).pipe(switchMap((control) => control.events.pipe(startWith(null)))),
  );

  // Mismo criterio que campoEsValido() del proyecto académico
  protected readonly mostrarError = computed(() => {
    this.cambios();
    const control = this.control();

    return control.invalid && control.touched;
  });
}