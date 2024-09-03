import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-featured-events',
  standalone: true,
  imports: [],
  templateUrl: './featured-events.component.html',
  styleUrl: './featured-events.component.css'
})
export class FeaturedEventsComponent implements OnInit {
  featuredEvents: Event[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.featuredEvents = this.eventService.getFeaturedEvents();
  }
}
