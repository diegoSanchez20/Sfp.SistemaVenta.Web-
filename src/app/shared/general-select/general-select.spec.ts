import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GeneralSelect } from './general-select';

describe('GeneralSelect', () => {
  let fixture: ComponentFixture<GeneralSelect>;
  let form: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralSelect],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    form = new FormGroup({ app: new FormControl('', Validators.required) });
    fixture = TestBed.createComponent(GeneralSelect);
    fixture.componentRef.setInput('fGroup', form);
    fixture.componentRef.setInput('controlName', 'app');
    fixture.componentRef.setInput('label', 'Aplicación');
    fixture.componentRef.setInput('errorMessage', 'La aplicación es obligatoria');
    fixture.componentRef.setInput('options', [{ id: 1, name: 'Ventas' }]);
    fixture.detectChanges();
  });

  it('should create y muestra la etiqueta', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('mat-label').textContent).toContain('Aplicación');
  });

  it('muestra el error solo cuando el control es inválido y fue tocado', async () => {
    expect(fixture.nativeElement.querySelector('mat-error')).toBeNull();

    form.markAllAsTouched();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-error')?.textContent).toContain('La aplicación es obligatoria');
  });

  it('falla con un mensaje claro si el control no existe', () => {
    const otro = TestBed.createComponent(GeneralSelect);
    otro.componentRef.setInput('fGroup', form);
    otro.componentRef.setInput('controlName', 'noExiste');

    expect(() => otro.detectChanges()).toThrowError(/no tiene un control llamado "noExiste"/);
  });
});
