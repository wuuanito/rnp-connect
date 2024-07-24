import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioLogisticaComponent } from './inicio-logistica.component';

describe('InicioLogisticaComponent', () => {
  let component: InicioLogisticaComponent;
  let fixture: ComponentFixture<InicioLogisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioLogisticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioLogisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
