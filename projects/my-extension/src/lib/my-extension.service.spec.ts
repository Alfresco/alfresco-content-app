import { TestBed } from '@angular/core/testing';

import { MyExtensionService } from './my-extension.service';

describe('MyExtensionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyExtensionService = TestBed.get(MyExtensionService);
    expect(service).toBeTruthy();
  });
});
