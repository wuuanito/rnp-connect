import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMateriasPrimasAlmacenComponent } from './ver-materias-primas-almacen.component';

describe('VerMateriasPrimasAlmacenComponent', () => {
  let component: VerMateriasPrimasAlmacenComponent;
  let fixture: ComponentFixture<VerMateriasPrimasAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerMateriasPrimasAlmacenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMateriasPrimasAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
