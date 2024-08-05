import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSolicitudMuestrasLogisticaComponent } from './ver-solicitud-muestras-logistica.component';

describe('VerSolicitudMuestrasLogisticaComponent', () => {
  let component: VerSolicitudMuestrasLogisticaComponent;
  let fixture: ComponentFixture<VerSolicitudMuestrasLogisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerSolicitudMuestrasLogisticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSolicitudMuestrasLogisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
