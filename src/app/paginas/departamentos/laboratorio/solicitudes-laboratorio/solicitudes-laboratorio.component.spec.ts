import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesLaboratorioComponent } from './solicitudes-laboratorio.component';

describe('SolicitudesLaboratorioComponent', () => {
  let component: SolicitudesLaboratorioComponent;
  let fixture: ComponentFixture<SolicitudesLaboratorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesLaboratorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
