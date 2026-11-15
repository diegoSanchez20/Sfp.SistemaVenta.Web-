import { Injectable, computed, signal } from '@angular/core';

/** Cuenta las peticiones HTTP en curso; el loader se muestra mientras haya al menos una */
@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly pendientes = signal(0);

  readonly visible = computed(() => this.pendientes() > 0);

  mostrar(): void {
    this.pendientes.update((n) => n + 1);
  }

  ocultar(): void {
    this.pendientes.update((n) => Math.max(0, n - 1));
  }
}
