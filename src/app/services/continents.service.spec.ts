import { TestBed } from '@angular/core/testing';

import { continentsService } from './continents.service';

describe('continentsService', () => {
  let service: continentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(continentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
