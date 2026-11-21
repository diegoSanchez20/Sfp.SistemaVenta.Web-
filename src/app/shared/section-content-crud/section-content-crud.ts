import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-section-content-crud',
  imports: [MatCardModule],
  templateUrl: './section-content-crud.html',
  styleUrl: './section-content-crud.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionContentCrud {}
