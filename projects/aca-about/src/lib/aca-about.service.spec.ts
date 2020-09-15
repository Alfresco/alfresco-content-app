import { TestBed } from '@angular/core/testing';

import { AcaAboutService } from './aca-about.service';

describe('AcaAboutService', () => {
  let service: AcaAboutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcaAboutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
