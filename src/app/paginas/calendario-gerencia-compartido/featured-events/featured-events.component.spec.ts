import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedEventsComponent } from './featured-events.component';

describe('FeaturedEventsComponent', () => {
  let component: FeaturedEventsComponent;
  let fixture: ComponentFixture<FeaturedEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
