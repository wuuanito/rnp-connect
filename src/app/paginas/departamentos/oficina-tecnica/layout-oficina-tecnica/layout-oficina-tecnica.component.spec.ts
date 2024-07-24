import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutOficinaTecnicaComponent } from './layout-oficina-tecnica.component';

describe('LayoutOficinaTecnicaComponent', () => {
  let component: LayoutOficinaTecnicaComponent;
  let fixture: ComponentFixture<LayoutOficinaTecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutOficinaTecnicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutOficinaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
