import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventDialogComponentComponent } from './add-event-dialog-component.component';

describe('AddEventDialogComponentComponent', () => {
  let component: AddEventDialogComponentComponent;
  let fixture: ComponentFixture<AddEventDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEventDialogComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
