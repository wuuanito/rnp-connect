import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSolicitudMuestrasLabComponent } from './ver-solicitud-muestras-lab.component';

describe('VerSolicitudMuestrasLabComponent', () => {
  let component: VerSolicitudMuestrasLabComponent;
  let fixture: ComponentFixture<VerSolicitudMuestrasLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerSolicitudMuestrasLabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSolicitudMuestrasLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
