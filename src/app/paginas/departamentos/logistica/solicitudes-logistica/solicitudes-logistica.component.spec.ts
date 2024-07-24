import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesLogisticaComponent } from './solicitudes-logistica.component';

describe('SolicitudesLogisticaComponent', () => {
  let component: SolicitudesLogisticaComponent;
  let fixture: ComponentFixture<SolicitudesLogisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesLogisticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesLogisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
