import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutMantenimientoComponent } from './layout-mantenimiento.component';

describe('LayoutMantenimientoComponent', () => {
  let component: LayoutMantenimientoComponent;
  let fixture: ComponentFixture<LayoutMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
