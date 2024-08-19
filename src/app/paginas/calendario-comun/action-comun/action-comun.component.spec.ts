import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionComunComponent } from './action-comun.component';

describe('ActionComunComponent', () => {
  let component: ActionComunComponent;
  let fixture: ComponentFixture<ActionComunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionComunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionComunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
