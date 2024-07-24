import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesOficinaTecnicaComponent } from './solicitudes-oficina-tecnica.component';

describe('SolicitudesOficinaTecnicaComponent', () => {
  let component: SolicitudesOficinaTecnicaComponent;
  let fixture: ComponentFixture<SolicitudesOficinaTecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesOficinaTecnicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesOficinaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
