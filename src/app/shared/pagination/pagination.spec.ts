import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagination } from './pagination';

describe('Pagination', () => {
  let fixture: ComponentFixture<Pagination>;

  const numeros = () =>
    Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('li button'))
      .map((b) => b.textContent!.trim())
      .filter((t) => /^\d+$/.test(t));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra todas las páginas si son 5 o menos', () => {
    fixture.componentRef.setInput('pagesTotal', 3);
    fixture.detectChanges();
    expect(numeros()).toEqual(['1', '2', '3']);
  });

  it('muestra una ventana de 5 centrada en la página actual', () => {
    fixture.componentRef.setInput('pagesTotal', 10);
    fixture.componentRef.setInput('pagesActual', 5);
    fixture.detectChanges();
    expect(numeros()).toEqual(['3', '4', '5', '6', '7']);
  });

  it('en los extremos la ventana no se sale del rango', () => {
    fixture.componentRef.setInput('pagesTotal', 10);
    fixture.componentRef.setInput('pagesActual', 10);
    fixture.detectChanges();
    expect(numeros()).toEqual(['6', '7', '8', '9', '10']);
  });

  it('emite la página elegida, la siguiente y la anterior', () => {
    const emitidas: number[] = [];
    fixture.componentInstance.eventChangePage.subscribe((p) => emitidas.push(p));
    fixture.componentRef.setInput('pagesTotal', 5);
    fixture.componentRef.setInput('pagesActual', 2);
    fixture.detectChanges();

    const botones: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('li button'));
    botones[4].click(); // número 4
    botones[0].click(); // anterior
    botones[botones.length - 1].click(); // siguiente

    expect(emitidas).toEqual([4, 1, 3]);
  });

  it('no emite al pulsar la página actual', () => {
    const emitidas: number[] = [];
    fixture.componentInstance.eventChangePage.subscribe((p) => emitidas.push(p));
    fixture.componentRef.setInput('pagesTotal', 3);
    fixture.componentRef.setInput('pagesActual', 2);
    fixture.detectChanges();

    (fixture.nativeElement.querySelectorAll('li button')[2] as HTMLButtonElement).click(); // número 2
    expect(emitidas).toEqual([]);
  });
});
