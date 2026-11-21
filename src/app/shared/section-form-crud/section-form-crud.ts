import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-section-form-crud',
  imports: [MatCardModule],
  templateUrl: './section-form-crud.html',
  styleUrl: './section-form-crud.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionFormCrud {}
