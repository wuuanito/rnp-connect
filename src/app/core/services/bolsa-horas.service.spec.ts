import { TestBed } from '@angular/core/testing';

import { BolsaHorasService } from './bolsa-horas.service';

describe('BolsaHorasService', () => {
  let service: BolsaHorasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BolsaHorasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
