import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutComprasComponent } from './layout-compras.component';

describe('LayoutComprasComponent', () => {
  let component: LayoutComprasComponent;
  let fixture: ComponentFixture<LayoutComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
