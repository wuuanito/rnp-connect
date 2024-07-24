import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesAdminsitracionComponent } from './solicitudes-adminsitracion.component';

describe('SolicitudesAdminsitracionComponent', () => {
  let component: SolicitudesAdminsitracionComponent;
  let fixture: ComponentFixture<SolicitudesAdminsitracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesAdminsitracionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesAdminsitracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
