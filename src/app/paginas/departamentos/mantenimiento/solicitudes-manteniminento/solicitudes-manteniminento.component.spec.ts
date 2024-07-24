import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesManteniminentoComponent } from './solicitudes-manteniminento.component';

describe('SolicitudesManteniminentoComponent', () => {
  let component: SolicitudesManteniminentoComponent;
  let fixture: ComponentFixture<SolicitudesManteniminentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesManteniminentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesManteniminentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
