import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioInformaticaComponent } from './inicio-informatica.component';

describe('InicioInformaticaComponent', () => {
  let component: InicioInformaticaComponent;
  let fixture: ComponentFixture<InicioInformaticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioInformaticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioInformaticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
