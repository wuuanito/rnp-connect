import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioComprasComponent } from './inicio-compras.component';

describe('InicioComprasComponent', () => {
  let component: InicioComprasComponent;
  let fixture: ComponentFixture<InicioComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioComprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
