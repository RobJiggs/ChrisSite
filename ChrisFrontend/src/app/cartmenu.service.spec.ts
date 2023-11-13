import { TestBed } from '@angular/core/testing';

import { CartmenuService } from './cartmenu.service';

describe('CartmenuService', () => {
  let service: CartmenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartmenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
