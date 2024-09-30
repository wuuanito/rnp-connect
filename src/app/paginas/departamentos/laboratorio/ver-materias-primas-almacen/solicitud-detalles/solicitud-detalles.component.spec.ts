import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudDetallesComponent } from './solicitud-detalles.component';

describe('SolicitudDetallesComponent', () => {
  let component: SolicitudDetallesComponent;
  let fixture: ComponentFixture<SolicitudDetallesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudDetallesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
