import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesInformaticaComponent } from './solicitudes-informatica.component';

describe('SolicitudesInformaticaComponent', () => {
  let component: SolicitudesInformaticaComponent;
  let fixture: ComponentFixture<SolicitudesInformaticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesInformaticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesInformaticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
