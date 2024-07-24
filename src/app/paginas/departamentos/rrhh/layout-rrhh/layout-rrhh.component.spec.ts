import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutRrhhComponent } from './layout-rrhh.component';

describe('LayoutRrhhComponent', () => {
  let component: LayoutRrhhComponent;
  let fixture: ComponentFixture<LayoutRrhhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutRrhhComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutRrhhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
