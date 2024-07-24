import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutAdministracionComponent } from './layout-administracion.component';

describe('LayoutAdministracionComponent', () => {
  let component: LayoutAdministracionComponent;
  let fixture: ComponentFixture<LayoutAdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutAdministracionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
