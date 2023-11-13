import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FemaleClothingComponent } from './female-clothing.component';

describe('FemaleClothingComponent', () => {
  let component: FemaleClothingComponent;
  let fixture: ComponentFixture<FemaleClothingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FemaleClothingComponent]
    });
    fixture = TestBed.createComponent(FemaleClothingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
