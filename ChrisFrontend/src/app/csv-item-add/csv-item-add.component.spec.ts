import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvItemAddComponent } from './csv-item-add.component';

describe('CsvItemAddComponent', () => {
  let component: CsvItemAddComponent;
  let fixture: ComponentFixture<CsvItemAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CsvItemAddComponent]
    });
    fixture = TestBed.createComponent(CsvItemAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
