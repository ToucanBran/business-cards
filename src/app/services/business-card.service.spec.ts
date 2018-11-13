import { TestBed } from '@angular/core/testing';

import { BusinessCardService } from './business-card.service';

describe('BusinessCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessCardService = TestBed.get(BusinessCardService);
    expect(service).toBeTruthy();
  });
});
