import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVisaComponent } from './new-visa.component';

describe('NewVisaComponent', () => {
  let component: NewVisaComponent;
  let fixture: ComponentFixture<NewVisaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVisaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
