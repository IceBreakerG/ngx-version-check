import { TestBed } from '@angular/core/testing';

import { VersionCheckService } from './version-check.service';

describe('VersionCheckService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VersionCheckService = TestBed.get(VersionCheckService);
    expect(service).toBeTruthy();
  });
});
