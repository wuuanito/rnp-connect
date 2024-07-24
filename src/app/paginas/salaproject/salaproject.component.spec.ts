import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaprojectComponent } from './salaproject.component';

describe('SalaprojectComponent', () => {
  let component: SalaprojectComponent;
  let fixture: ComponentFixture<SalaprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaprojectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
