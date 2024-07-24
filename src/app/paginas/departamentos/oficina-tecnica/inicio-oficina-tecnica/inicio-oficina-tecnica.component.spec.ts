import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioOficinaTecnicaComponent } from './inicio-oficina-tecnica.component';

describe('InicioOficinaTecnicaComponent', () => {
  let component: InicioOficinaTecnicaComponent;
  let fixture: ComponentFixture<InicioOficinaTecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioOficinaTecnicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioOficinaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
