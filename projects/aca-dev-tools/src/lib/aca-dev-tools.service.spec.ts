import { TestBed, inject } from '@angular/core/testing';

import { AcaDevToolsService } from './aca-dev-tools.service';

describe('AcaDevToolsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AcaDevToolsService]
    });
  });

  it('should be created', inject([AcaDevToolsService], (service: AcaDevToolsService) => {
    expect(service).toBeTruthy();
  }));
});
