import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioRrhhComponent } from './inicio-rrhh.component';

describe('InicioRrhhComponent', () => {
  let component: InicioRrhhComponent;
  let fixture: ComponentFixture<InicioRrhhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioRrhhComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioRrhhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
