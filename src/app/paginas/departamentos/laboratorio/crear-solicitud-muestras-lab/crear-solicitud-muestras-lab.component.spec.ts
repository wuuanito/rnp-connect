import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSolicitudMuestrasLabComponent } from './crear-solicitud-muestras-lab.component';

describe('CrearSolicitudMuestrasLabComponent', () => {
  let component: CrearSolicitudMuestrasLabComponent;
  let fixture: ComponentFixture<CrearSolicitudMuestrasLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearSolicitudMuestrasLabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearSolicitudMuestrasLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
