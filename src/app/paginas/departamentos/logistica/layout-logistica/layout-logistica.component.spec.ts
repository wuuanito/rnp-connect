import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutLogisticaComponent } from './layout-logistica.component';

describe('LayoutLogisticaComponent', () => {
  let component: LayoutLogisticaComponent;
  let fixture: ComponentFixture<LayoutLogisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutLogisticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutLogisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
