import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesGerenciaComponent } from './solicitudes-gerencia.component';

describe('SolicitudesGerenciaComponent', () => {
  let component: SolicitudesGerenciaComponent;
  let fixture: ComponentFixture<SolicitudesGerenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesGerenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
