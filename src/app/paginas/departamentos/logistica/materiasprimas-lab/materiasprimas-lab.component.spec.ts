import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriasprimasLabComponent } from './materiasprimas-lab.component';

describe('MateriasprimasLabComponent', () => {
  let component: MateriasprimasLabComponent;
  let fixture: ComponentFixture<MateriasprimasLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriasprimasLabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateriasprimasLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
