import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSolicitudAlmacenComponent } from './crear-solicitud-almacen.component';

describe('CrearSolicitudAlmacenComponent', () => {
  let component: CrearSolicitudAlmacenComponent;
  let fixture: ComponentFixture<CrearSolicitudAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearSolicitudAlmacenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearSolicitudAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
