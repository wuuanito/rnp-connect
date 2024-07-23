import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutProduccionComponent } from './layout-produccion.component';

describe('LayoutProduccionComponent', () => {
  let component: LayoutProduccionComponent;
  let fixture: ComponentFixture<LayoutProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutProduccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
