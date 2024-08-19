import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmComunComponent } from './confirm-comun.component';

describe('ConfirmComunComponent', () => {
  let component: ConfirmComunComponent;
  let fixture: ComponentFixture<ConfirmComunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmComunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmComunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
