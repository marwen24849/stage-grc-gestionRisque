import { TestBed } from '@angular/core/testing';

import { ActiviteServiceService } from './activite-service.service';

describe('ActiviteServiceService', () => {
  let service: ActiviteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiviteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
