import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaleClothingComponent } from './male-clothing.component';

describe('MaleClothingComponent', () => {
  let component: MaleClothingComponent;
  let fixture: ComponentFixture<MaleClothingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaleClothingComponent]
    });
    fixture = TestBed.createComponent(MaleClothingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
