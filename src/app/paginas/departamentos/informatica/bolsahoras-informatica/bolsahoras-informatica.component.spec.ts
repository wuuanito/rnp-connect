import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BolsahorasInformaticaComponent } from './bolsahoras-informatica.component';

describe('BolsahorasInformaticaComponent', () => {
  let component: BolsahorasInformaticaComponent;
  let fixture: ComponentFixture<BolsahorasInformaticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BolsahorasInformaticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BolsahorasInformaticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
