import { TestBed } from '@angular/core/testing';

import { CartMenuToggleService } from './cart-menu-toggle.service';

describe('CartMenuToggleService', () => {
  let service: CartMenuToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartMenuToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
