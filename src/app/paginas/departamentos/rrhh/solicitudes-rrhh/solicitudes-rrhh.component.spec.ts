import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesRrhhComponent } from './solicitudes-rrhh.component';

describe('SolicitudesRrhhComponent', () => {
  let component: SolicitudesRrhhComponent;
  let fixture: ComponentFixture<SolicitudesRrhhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesRrhhComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesRrhhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
