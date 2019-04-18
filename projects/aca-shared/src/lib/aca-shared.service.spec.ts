import { TestBed } from '@angular/core/testing';

import { AcaSharedService } from './aca-shared.service';

describe('AcaSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcaSharedService = TestBed.get(AcaSharedService);
    expect(service).toBeTruthy();
  });
});
