import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalacomunComponent } from './salacomun.component';

describe('SalacomunComponent', () => {
  let component: SalacomunComponent;
  let fixture: ComponentFixture<SalacomunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalacomunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalacomunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
