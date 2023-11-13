import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressinfoComponent } from './addressinfo.component';

describe('AddressinfoComponent', () => {
  let component: AddressinfoComponent;
  let fixture: ComponentFixture<AddressinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressinfoComponent]
    });
    fixture = TestBed.createComponent(AddressinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
