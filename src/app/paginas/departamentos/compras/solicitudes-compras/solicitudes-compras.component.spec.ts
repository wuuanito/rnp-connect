import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesComprasComponent } from './solicitudes-compras.component';

describe('SolicitudesComprasComponent', () => {
  let component: SolicitudesComprasComponent;
  let fixture: ComponentFixture<SolicitudesComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesComprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
