import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsServicesComponent } from './items-services.component';

describe('ItemsServicesComponent', () => {
  let component: ItemsServicesComponent;
  let fixture: ComponentFixture<ItemsServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsServicesComponent]
    });
    fixture = TestBed.createComponent(ItemsServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
