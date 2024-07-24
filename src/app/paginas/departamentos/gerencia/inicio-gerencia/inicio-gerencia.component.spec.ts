import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioGerenciaComponent } from './inicio-gerencia.component';

describe('InicioGerenciaComponent', () => {
  let component: InicioGerenciaComponent;
  let fixture: ComponentFixture<InicioGerenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioGerenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
