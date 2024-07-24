import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioMantenimientoComponent } from './inicio-mantenimiento.component';

describe('InicioMantenimientoComponent', () => {
  let component: InicioMantenimientoComponent;
  let fixture: ComponentFixture<InicioMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
