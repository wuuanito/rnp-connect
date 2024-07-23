import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesProduccionComponent } from './solicitudes-produccion.component';

describe('SolicitudesProduccionComponent', () => {
  let component: SolicitudesProduccionComponent;
  let fixture: ComponentFixture<SolicitudesProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesProduccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
