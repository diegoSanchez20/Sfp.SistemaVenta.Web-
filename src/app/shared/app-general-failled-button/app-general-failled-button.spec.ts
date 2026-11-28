import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGeneralFailledButton } from './app-general-failled-button';

describe('AppGeneralFailledButton', () => {
  let component: AppGeneralFailledButton;
  let fixture: ComponentFixture<AppGeneralFailledButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppGeneralFailledButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppGeneralFailledButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
