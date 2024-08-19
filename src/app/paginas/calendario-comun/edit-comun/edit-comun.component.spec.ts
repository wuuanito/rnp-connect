import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComunComponent } from './edit-comun.component';

describe('EditComunComponent', () => {
  let component: EditComunComponent;
  let fixture: ComponentFixture<EditComunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditComunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditComunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
