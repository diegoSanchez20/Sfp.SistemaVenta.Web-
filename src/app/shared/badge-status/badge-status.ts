import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge-status',
  templateUrl: './badge-status.html',
  styleUrl: './badge-status.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeStatus {
  readonly statusColor = input<'habilitado' | 'deshabilitado'>('habilitado');
  readonly nameStatus = input('');
}
