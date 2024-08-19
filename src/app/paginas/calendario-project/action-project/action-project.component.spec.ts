import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionProjectComponent } from './action-project.component';

describe('ActionProjectComponent', () => {
  let component: ActionProjectComponent;
  let fixture: ComponentFixture<ActionProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
