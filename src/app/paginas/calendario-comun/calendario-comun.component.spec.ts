import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioComunComponent } from './calendario-comun.component';

describe('CalendarioComunComponent', () => {
  let component: CalendarioComunComponent;
  let fixture: ComponentFixture<CalendarioComunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioComunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioComunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
