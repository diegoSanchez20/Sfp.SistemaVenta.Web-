import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

// Cantidad de números de página que se muestran a la vez
const VENTANA = 5;

@Component({
  selector: 'app-pagination',
  imports: [MatIconModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  readonly pagesTotal = input(0);
  readonly pagesActual = input(1);
  readonly totalRows = input(0);
  readonly eventChangePage = output<number>();

  // Números visibles: todos si son pocos; si no, una ventana de 5 centrada en la página actual
  protected readonly pages = computed(() => {
    const total = this.pagesTotal();

    if (total <= VENTANA) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const inicio = Math.min(Math.max(this.pagesActual() - 2, 1), total - VENTANA + 1);

    return Array.from({ length: VENTANA }, (_, i) => inicio + i);
  });

  protected selectPage(page: number): void {
    if (page !== this.pagesActual()) {
      this.eventChangePage.emit(page);
    }
  }

  protected prevPage(): void {
    if (this.pagesActual() > 1) {
      this.eventChangePage.emit(this.pagesActual() - 1);
    }
  }

  protected nextPage(): void {
    if (this.pagesActual() < this.pagesTotal()) {
      this.eventChangePage.emit(this.pagesActual() + 1);
    }
  }
}
