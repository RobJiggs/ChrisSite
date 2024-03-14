import { TestBed } from '@angular/core/testing';

import { ItemdetailService } from './itemdetail.service';

describe('ItemdetailService', () => {
  let service: ItemdetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemdetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
