import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioLaboratorioComponent } from './inicio-laboratorio.component';

describe('InicioLaboratorioComponent', () => {
  let component: InicioLaboratorioComponent;
  let fixture: ComponentFixture<InicioLaboratorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioLaboratorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
