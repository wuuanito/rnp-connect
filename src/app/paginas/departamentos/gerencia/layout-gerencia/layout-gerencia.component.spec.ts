import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutGerenciaComponent } from './layout-gerencia.component';

describe('LayoutGerenciaComponent', () => {
  let component: LayoutGerenciaComponent;
  let fixture: ComponentFixture<LayoutGerenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutGerenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
