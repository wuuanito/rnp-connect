import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudPersonalComponent } from './solicitud-personal.component';

describe('SolicitudPersonalComponent', () => {
  let component: SolicitudPersonalComponent;
  let fixture: ComponentFixture<SolicitudPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
