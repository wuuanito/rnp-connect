import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSolicitudMuestrasComponent } from './crear-solicitud-muestras.component';

describe('CrearSolicitudMuestrasComponent', () => {
  let component: CrearSolicitudMuestrasComponent;
  let fixture: ComponentFixture<CrearSolicitudMuestrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearSolicitudMuestrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearSolicitudMuestrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
