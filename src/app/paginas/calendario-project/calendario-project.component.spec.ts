import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioProjectComponent } from './calendario-project.component';

describe('CalendarioProjectComponent', () => {
  let component: CalendarioProjectComponent;
  let fixture: ComponentFixture<CalendarioProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
