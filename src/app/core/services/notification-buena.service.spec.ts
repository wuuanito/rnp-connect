import { TestBed } from '@angular/core/testing';

import { NotificationBuenaService } from './notification-buena.service';

describe('NotificationBuenaService', () => {
  let service: NotificationBuenaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationBuenaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
