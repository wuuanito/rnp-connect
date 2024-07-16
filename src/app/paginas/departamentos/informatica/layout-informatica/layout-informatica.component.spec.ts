import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutInformaticaComponent } from './layout-informatica.component';

describe('LayoutInformaticaComponent', () => {
  let component: LayoutInformaticaComponent;
  let fixture: ComponentFixture<LayoutInformaticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutInformaticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutInformaticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
