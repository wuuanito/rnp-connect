import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesMuestraAlmacenComponent } from './solicitudes-muestra-almacen.component';

describe('SolicitudesMuestraAlmacenComponent', () => {
  let component: SolicitudesMuestraAlmacenComponent;
  let fixture: ComponentFixture<SolicitudesMuestraAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesMuestraAlmacenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesMuestraAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
