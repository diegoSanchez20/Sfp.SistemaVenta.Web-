import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionFormCrud } from './section-form-crud';

@Component({
  imports: [SectionFormCrud],
  template: `
    <app-section-form-crud>
      <span id="title-form-crud">Titulo</span>
      <span id="description-form-crud">Descripcion</span>
      <div id="content-form-crud">Contenido</div>
      <button id="action-form-crud">Guardar</button>
    </app-section-form-crud>
  `,
})
class Host {}

describe('SectionFormCrud', () => {
  let fixture: ComponentFixture<SectionFormCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionFormCrud, Host],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionFormCrud);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('projects title, description, content and actions into their slots', () => {
    const host = TestBed.createComponent(Host);
    host.detectChanges();
    const el: HTMLElement = host.nativeElement;

    expect(el.querySelector('.title-crud #title-form-crud')?.textContent).toBe('Titulo');
    expect(el.querySelector('.description #description-form-crud')?.textContent).toBe('Descripcion');
    expect(el.querySelector('mat-card-content #content-form-crud')?.textContent).toBe('Contenido');
    expect(el.querySelector('mat-card-actions #action-form-crud')?.textContent).toBe('Guardar');
  });
});
