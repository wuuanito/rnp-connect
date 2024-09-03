import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListComponentComponent } from './event-list-component.component';

describe('EventListComponentComponent', () => {
  let component: EventListComponentComponent;
  let fixture: ComponentFixture<EventListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
