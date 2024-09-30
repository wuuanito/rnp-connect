import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSolicitudMuestrasComponent } from './ver-solicitud-muestras.component';

describe('VerSolicitudMuestrasComponent', () => {
  let component: VerSolicitudMuestrasComponent;
  let fixture: ComponentFixture<VerSolicitudMuestrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerSolicitudMuestrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSolicitudMuestrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
