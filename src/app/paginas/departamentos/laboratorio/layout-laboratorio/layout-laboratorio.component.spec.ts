import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutLaboratorioComponent } from './layout-laboratorio.component';

describe('LayoutLaboratorioComponent', () => {
  let component: LayoutLaboratorioComponent;
  let fixture: ComponentFixture<LayoutLaboratorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutLaboratorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
