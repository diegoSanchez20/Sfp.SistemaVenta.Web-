import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-section-item-crud',
  imports: [MatCardModule],
  templateUrl: './section-item-crud.html',
  styleUrl: './section-item-crud.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionItemCrud {}
