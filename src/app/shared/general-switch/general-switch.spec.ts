import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSwitch } from './general-switch';

describe('GeneralSwitch', () => {
  let component: GeneralSwitch;
  let fixture: ComponentFixture<GeneralSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralSwitch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
