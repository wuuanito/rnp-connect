import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsolicitudesComponent } from './modalsolicitudes.component';

describe('ModalsolicitudesComponent', () => {
  let component: ModalsolicitudesComponent;
  let fixture: ComponentFixture<ModalsolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalsolicitudesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalsolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
