import { TestBed } from '@angular/core/testing';

import { SizeSelectionService } from './size-selection.service';

describe('SizeSelectionService', () => {
  let service: SizeSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SizeSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
