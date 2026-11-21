import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralButton } from './general-button';

describe('GeneralButton', () => {
  let fixture: ComponentFixture<GeneralButton>;

  const boton = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralButton],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralButton);
    fixture.detectChanges();
  });

  it('should create con los valores por defecto (guardar)', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(boton().type).toBe('button');
    expect(boton().title).toBe('Guardar');
    expect(boton().textContent).toContain('save');
  });

  it('emite clicked al pulsar', () => {
    let veces = 0;
    fixture.componentInstance.clicked.subscribe(() => veces++);

    boton().click();

    expect(veces).toBe(1);
  });

  it('no emite si está deshabilitado', () => {
    let veces = 0;
    fixture.componentInstance.clicked.subscribe(() => veces++);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    boton().click();

    expect(veces).toBe(0);
  });

  it('usa el icono, tooltip y tipo recibidos', () => {
    fixture.componentRef.setInput('icon', 'close');
    fixture.componentRef.setInput('tooltip', 'Cancelar');
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    expect(boton().textContent).toContain('close');
    expect(boton().title).toBe('Cancelar');
    expect(boton().type).toBe('submit');
  });

  it('con color "secondary" (o sin color) el botón es gris; con primary no', () => {
    expect(boton().classList).not.toContain('gris');

    fixture.componentRef.setInput('color', 'secondary');
    fixture.detectChanges();
    expect(boton().classList).toContain('gris');
    expect(getComputedStyle(boton()).getPropertyValue('--mat-fab-small-container-color').trim()).toBe('#e0e0e0');

    fixture.componentRef.setInput('color', undefined);
    fixture.detectChanges();
    expect(boton().classList).toContain('gris');
  });

  it('dibuja un icono de Font Awesome cuando el valor empieza por "fa-"', () => {
    fixture.componentRef.setInput('icon', 'fa-solid fa-xmark');
    fixture.detectChanges();

    const icono: HTMLElement | null = boton().querySelector('i.fa-solid.fa-xmark');
    expect(icono).not.toBeNull();
    expect(boton().querySelector('mat-icon')).toBeNull();
  });
});
