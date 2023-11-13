import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherheaderComponent } from './otherheader.component';

describe('OtherheaderComponent', () => {
  let component: OtherheaderComponent;
  let fixture: ComponentFixture<OtherheaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherheaderComponent]
    });
    fixture = TestBed.createComponent(OtherheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
