import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioProduccionComponent } from './inicio-produccion.component';

describe('InicioProduccionComponent', () => {
  let component: InicioProduccionComponent;
  let fixture: ComponentFixture<InicioProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioProduccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
