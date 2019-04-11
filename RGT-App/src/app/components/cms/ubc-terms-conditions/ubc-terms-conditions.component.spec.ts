import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbcTermsConditionsComponent } from './ubc-terms-conditions.component';

describe('UbcTermsConditionsComponent', () => {
  let component: UbcTermsConditionsComponent;
  let fixture: ComponentFixture<UbcTermsConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbcTermsConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbcTermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
